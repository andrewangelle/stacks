import type { APIRequestContext, Page } from '@playwright/test';
import { expect, test } from '~test/fixtures';
import { expectListCardCount } from '~test/helpers/expectListHeaderCardCount';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedListCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

type ChecklistSeed = {
  title: string;
  items: string[];
};

test.describe('Checklist', () => {
  test.describe.configure({ timeout: 60_000 });

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

  test('converts a checklist item to a card in the card modal', async ({
    page,
    request,
  }) => {
    const { board } = await openCardWithChecklists(page, request, [
      {
        title: 'Launch checklist',
        items: ['Deploy to staging', 'Notify team'],
      },
    ]);

    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(2);

    const firstItem = page.getByTestId('ChecklistCheckboxContainer').first();
    await firstItem.getByTestId('ChecklistContentColumn').hover();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistCheckboxContainer"] [data-testid="ChecklistItemOptionsEllipsis"]',
    );

    await waitForChecklistItemConverted(page);

    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(1);
    await expect(page.getByTestId('CheckboxLabel')).toHaveText('Notify team');

    await page.goto(`/board/${board.id}`);

    await expectListCardCount(page.getByTestId('ListContainer'), 2);
    await expect(
      page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Deploy to staging' }),
    ).toBeVisible();
    await expect(
      page.getByTestId('ListCardContainer').filter({ hasText: 'Ship feature' }),
    ).toBeVisible();

    await waitForHydratedAction(
      () =>
        page
          .getByTestId('ListCardContainer')
          .filter({ hasText: 'Deploy to staging' })
          .click(),
      () => page.getByTestId('CardModalContent').isVisible(),
    );

    await expect(page.getByTestId('CardModalContent')).toBeVisible();
    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Deploy to staging');

    const activityColumn = page.getByTestId('CardActivityColumn');
    const toggleButton = activityColumn.getByTestId('HideActivityButton');

    if (await toggleButton.getByText('Show details').isVisible()) {
      await toggleButton.click();
    }

    await expect(
      activityColumn
        .getByTestId('ActivityCommentContainer')
        .filter({ hasText: 'converted this card from a checklist item' }),
    ).toBeVisible();
    await expect(
      activityColumn
        .getByTestId('ActivityCommentContainer')
        .filter({ hasText: 'Ship feature' }),
    ).toBeVisible();
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

    const firstItem = page.getByTestId('ChecklistCheckboxContainer').first();
    await firstItem.getByTestId('ChecklistContentColumn').hover();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistCheckboxContainer"] [data-testid="ChecklistItemOptionsEllipsis"]',
    );

    await page
      .getByTestId('PopoverOptionsContent')
      .getByTestId('DeleteChecklistItemButton')
      .click();

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

  test('hides and shows completed checklist items and persists the setting', async ({
    page,
    request,
  }) => {
    await openCardWithChecklists(page, request, [
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await waitForChecked(page);

    const toggleButton = page.getByTestId('ToggleCheckedItemsButton');
    await expect(toggleButton).toHaveText('Hide completed items');
    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(1);

    await waitForToggleCheckedItems(page);

    await expect(toggleButton).toHaveText('Show completed items (1)');
    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(page.getByTestId('AllItemsCompleteMessage')).toHaveText(
      'Everything in this checklist is complete!',
    );

    await page.reload();
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
    await expect(toggleButton).toHaveText('Show completed items (1)');
    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(page.getByTestId('AllItemsCompleteMessage')).toBeVisible();
  });

  test('deletes a checklist in the card modal', async ({ page, request }) => {
    await openCardWithChecklists(page, request, [
      { title: 'Launch checklist', items: ['Deploy to staging'] },
      { title: 'QA checklist', items: ['Run tests'] },
    ]);

    await expect(page.getByTestId('ChecklistContainer')).toHaveCount(2);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistHeader"] [data-testid="DeleteChecklistButton"]',
    );

    await page
      .getByTestId('PopoverOptionsContent')
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
  await expect(page.getByTestId('ChecklistContainer').first()).toBeVisible();

  return { board, card };
}

function waitForChecked(page: Page) {
  const trigger = () => page.getByTestId('CheckboxRoot').first().click();

  const isChecked = async () =>
    (await page
      .getByTestId('CheckboxRoot')
      .first()
      .getAttribute('data-state')) === 'checked';

  return waitForHydratedAction(trigger, isChecked);
}

function waitForLabelToBeUpdated(page: Page) {
  const label = page.getByTestId('CheckboxLabel').first();

  const trigger = () =>
    page
      .getByTestId('EditChecklistItemContainer')
      .getByTestId('AddChecklistButton')
      .click();

  const isUpdated = async () =>
    (await label.count()) > 0 &&
    (await label.textContent())?.trim() === 'Deploy to production';

  return waitForHydratedAction(trigger, isUpdated);
}

function waitForTitleToBeUpdated(page: Page) {
  const title = page.getByTestId('ChecklistTitle').first();

  const trigger = () => page.getByTestId('DescriptionTitle').click();

  const isUpdated = async () =>
    (await title.count()) > 0 &&
    (await title.textContent())?.trim() === 'Release checklist';

  return waitForHydratedAction(trigger, isUpdated);
}

function waitForChecklistItemConverted(page: Page) {
  const trigger = () =>
    page
      .getByTestId('PopoverOptionsContent')
      .getByTestId('ConvertChecklistItemToCardButton')
      .click();

  const isConverted = async () =>
    (await page.getByTestId('CheckboxLabel').count()) === 1 &&
    (await page.getByTestId('CheckboxLabel').first().textContent())?.trim() ===
      'Notify team';

  return waitForHydratedAction(trigger, isConverted);
}

function waitForToggleCheckedItems(page: Page) {
  const toggleButton = page.getByTestId('ToggleCheckedItemsButton');

  const trigger = () => toggleButton.click();

  const isHidden = async () =>
    (await page.getByTestId('CheckboxLabel').count()) === 0 &&
    (await toggleButton.textContent())?.includes('Show completed items (1)') ===
      true;

  return waitForHydratedAction(trigger, isHidden);
}
