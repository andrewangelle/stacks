import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedListCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

type ChecklistSeed = {
  title: string;
  items: string[];
};

test.describe('Checklist', () => {
  test('marks a checklist item complete in the card modal', async ({
    page,
    request,
  }) => {
    await openCardWithChecklists(page, request, [
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checkbox = page.getByTestId('CheckboxRoot');
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    await waitForChecked(page);
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
    await expect(page.getByTestId('ChecklistProgressPercentage')).toHaveText(
      '100%',
    );
    await expect(page.getByTestId('CheckboxLabel')).toHaveCSS(
      'text-decoration',
      /line-through/,
    );
  });

  test('edits a checklist item label in the card modal', async ({
    page,
    request,
  }) => {
    await openCardWithChecklists(page, request, [
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="EditChecklistItemContainer"]',
      '[data-testid="CheckboxLabel"]',
    );

    const editForm = page.getByTestId('EditChecklistItemContainer');
    await editForm
      .getByTestId('AddChecklistItemInput')
      .fill('Deploy to production');

    await waitForLabelToBeUpdated(page);

    await expect(page.getByTestId('CheckboxLabel')).toHaveText(
      'Deploy to production',
    );
  });

  test('deletes a checklist item in the card modal', async ({
    page,
    request,
  }) => {
    await openCardWithChecklists(page, request, [
      {
        title: 'Launch checklist',
        items: ['Deploy to staging', 'Notify team'],
      },
    ]);

    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(2);

    await page.getByTestId('ChecklistCheckboxContainer').first().hover();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DeleteChecklistPopoverContent"]',
      '[data-testid="DeleteChecklistPopoverTrigger"] svg',
    );

    await page.getByTestId('DeleteChecklistPopoverButton').click();

    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(1);
    await expect(page.getByTestId('CheckboxLabel')).toHaveText('Notify team');
  });

  test('edits the checklist title in the card modal', async ({
    page,
    request,
  }) => {
    await openCardWithChecklists(page, request, [
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="ChecklistTitle"]',
    );

    await page
      .getByTestId('ChecklistContainer')
      .getByTestId('EditCardTitleInput')
      .fill('Release checklist');

    await waitForTitleToBeUpdated(page);

    await expect(page.getByTestId('ChecklistTitle')).toHaveText(
      'Release checklist',
    );
  });

  test('deletes a checklist in the card modal', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedListCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists: [
        { title: 'Launch checklist', items: ['Deploy to staging'] },
        { title: 'QA checklist', items: ['Run tests'] },
      ],
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(page.getByTestId('ChecklistContainer')).toHaveCount(2);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DeleteChecklistPopoverContent"]',
      '[data-testid="DeleteChecklistButton"]',
    );

    await page
      .getByTestId('ChecklistHeader')
      .first()
      .getByTestId('DeleteChecklistPopoverButton')
      .click();

    await expect(page.getByTestId('ChecklistContainer')).toHaveCount(1);
    await expect(page.getByTestId('ChecklistTitle')).toHaveText('QA checklist');
  });
});

/**
 * Helpers for this test file
 */
async function openCardWithChecklists(
  page: Page,
  request: APIRequestContext,
  checklists: ChecklistSeed[],
) {
  await resetDb(request);
  const board = await seedBoard(request, 'Sprint Board');
  const { card } = await seedListCard(request, {
    boardId: board.id,
    listTitle: 'To Do',
    cardTitle: 'Ship feature',
    checklists,
  });

  await page.goto(`/board/${board.id}/card/${card.id}`);
  await expect(page.getByTestId('CardModalContent')).toBeVisible();
  await expect(page.getByTestId('ChecklistContainer')).toBeVisible();

  return { board, card };
}

function waitForChecked(page: Page) {
  function isChecked() {
    return (
      document
        .querySelector('[data-testid="CheckboxRoot"]')
        ?.getAttribute('data-state') === 'checked'
    );
  }

  return waitForHydratedAction(page, '[data-testid="CheckboxRoot"]', isChecked);
}

function waitForLabelToBeUpdated(page: Page) {
  function isLabelUpdated() {
    return (
      document
        .querySelector('[data-testid="CheckboxLabel"]')
        ?.textContent?.trim() === 'Deploy to production'
    );
  }

  return waitForHydratedAction(
    page,
    '[data-testid="EditChecklistItemContainer"] [data-testid="AddChecklistButton"]',
    isLabelUpdated,
  );
}

function waitForTitleToBeUpdated(page: Page) {
  function isTitleUpdated() {
    return (
      document
        .querySelector('[data-testid="ChecklistTitle"]')
        ?.textContent?.trim() === 'Release checklist'
    );
  }

  return waitForHydratedAction(
    page,
    '[data-testid="DescriptionTitle"]',
    isTitleUpdated,
  );
}
