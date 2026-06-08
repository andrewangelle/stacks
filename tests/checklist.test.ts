import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedListCard } from '~test/helpers/seed';
import { waitForPopover } from '~test/helpers/waitForPopover';

type ChecklistSeed = {
  title: string;
  items: string[];
};

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

    await page.waitForFunction(() => {
      const root = document.querySelector('[data-testid="CheckboxRoot"]');
      if (root?.getAttribute('data-state') === 'checked') return true;
      root?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return (
        document
          .querySelector('[data-testid="CheckboxRoot"]')
          ?.getAttribute('data-state') === 'checked'
      );
    });

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

    await waitForPopover(
      page,
      'EditChecklistItemContainer',
      '[data-testid="CheckboxLabel"]',
    );

    const editForm = page.getByTestId('EditChecklistItemContainer');
    await editForm
      .getByTestId('AddChecklistItemInput')
      .fill('Deploy to production');

    await page.waitForFunction(() => {
      const label = document.querySelector('[data-testid="CheckboxLabel"]');
      if (label?.textContent?.trim() === 'Deploy to production') return true;
      document
        .querySelector(
          '[data-testid="EditChecklistItemContainer"] [data-testid="AddChecklistButton"]',
        )
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return (
        document
          .querySelector('[data-testid="CheckboxLabel"]')
          ?.textContent?.trim() === 'Deploy to production'
      );
    });

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

    await page.waitForFunction(() => {
      if (
        document.querySelector('[data-testid="DeleteChecklistPopoverContent"]')
      ) {
        return true;
      }
      document
        .querySelector('[data-testid="DeleteChecklistPopoverTrigger"] svg')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return !!document.querySelector(
        '[data-testid="DeleteChecklistPopoverContent"]',
      );
    });

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

    await waitForPopover(
      page,
      'EditCardTitleInput',
      '[data-testid="ChecklistTitle"]',
    );

    await page
      .getByTestId('ChecklistContainer')
      .getByTestId('EditCardTitleInput')
      .fill('Release checklist');

    await page.waitForFunction(() => {
      const title = document.querySelector('[data-testid="ChecklistTitle"]');
      if (title?.textContent?.trim() === 'Release checklist') return true;
      document
        .querySelector('[data-testid="DescriptionTitle"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return (
        document
          .querySelector('[data-testid="ChecklistTitle"]')
          ?.textContent?.trim() === 'Release checklist'
      );
    });

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

    await page.waitForFunction(() => {
      if (
        document.querySelector('[data-testid="DeleteChecklistPopoverContent"]')
      ) {
        return true;
      }
      document
        .querySelector('[data-testid="DeleteChecklistButton"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return !!document.querySelector(
        '[data-testid="DeleteChecklistPopoverContent"]',
      );
    });

    await page
      .getByTestId('ChecklistHeader')
      .first()
      .getByTestId('DeleteChecklistPopoverButton')
      .click();

    await expect(page.getByTestId('ChecklistContainer')).toHaveCount(1);
    await expect(page.getByTestId('ChecklistTitle')).toHaveText('QA checklist');
  });
});
