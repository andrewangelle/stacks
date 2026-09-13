import { expect, test } from '~test/fixtures';
import { CardPageChecklists } from '~test/helpers/CardPageChecklists';

test.describe('Checklist', () => {
  let cardPage: CardPageChecklists;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPageChecklists(page, request);
  });

  test.describe.configure({ timeout: 60_000 });

  test('marks a checklist item complete in the card modal', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checkbox = cardPage.page.getByTestId('CheckboxRoot');
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    await cardPage.waitForChecked();
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
    await expect(
      cardPage.page.getByTestId('ChecklistProgressPercentage'),
    ).toHaveText('100%');
    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCSS(
      'text-decoration',
      /line-through/,
    );
  });

  test('edits a checklist item label in the card modal', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="EditChecklistItemContainer"]',
      '[data-testid="CheckboxLabel"]',
    );

    const editForm = cardPage.page.getByTestId('EditChecklistItemContainer');
    await editForm
      .getByTestId('AddChecklistItemInput')
      .fill('Deploy to production');

    await cardPage.waitForLabelToBeUpdated();

    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveText(
      'Deploy to production',
    );
  });

  test('converts a checklist item to a card in the card modal', async () => {
    const { board } = await cardPage.setupWithChecklists([
      {
        title: 'Launch checklist',
        items: ['Deploy to staging', 'Notify team'],
      },
    ]);

    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCount(2);

    const firstItem = cardPage.page
      .getByTestId('ChecklistCheckboxContainer')
      .first();
    await firstItem.getByTestId('ChecklistContentColumn').hover();

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistCheckboxContainer"] [data-testid="ChecklistItemOptionsEllipsis"]',
    );

    await cardPage.waitForChecklistItemConverted();

    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCount(1);
    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveText(
      'Notify team',
    );

    await cardPage.page.goto(`/board/${board.id}`);

    await cardPage.expectListCardCount(2);
    await expect(
      cardPage.page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Deploy to staging' }),
    ).toBeVisible();
    await expect(
      cardPage.page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Ship feature' }),
    ).toBeVisible();

    await cardPage.waitForHydratedAction(
      () =>
        cardPage.page
          .getByTestId('ListCardContainer')
          .filter({ hasText: 'Deploy to staging' })
          .click(),
      () => cardPage.page.getByTestId('CardModalContent').isVisible(),
    );

    await expect(
      cardPage.page
        .getByTestId('CardModalTitleContainer')
        .getByTestId('CardModalTitle'),
    ).toHaveText('Deploy to staging');

    const activityColumn = cardPage.page.getByTestId('CardActivityColumn');
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

  test('deletes a checklist item in the card modal', async () => {
    await cardPage.setupWithChecklists([
      {
        title: 'Launch checklist',
        items: ['Deploy to staging', 'Notify team'],
      },
    ]);

    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCount(2);

    const firstItem = cardPage.page
      .getByTestId('ChecklistCheckboxContainer')
      .first();
    await firstItem.getByTestId('ChecklistContentColumn').hover();

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistCheckboxContainer"] [data-testid="ChecklistItemOptionsEllipsis"]',
    );

    await cardPage.page
      .getByTestId('PopoverOptionsContent')
      .getByTestId('DeleteChecklistItemButton')
      .click();

    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCount(1);
    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveText(
      'Notify team',
    );
  });

  test('edits the checklist title in the card modal', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="ChecklistTitle"]',
    );

    await cardPage.page
      .getByTestId('ChecklistContainer')
      .getByTestId('EditCardTitleInput')
      .fill('Release checklist');

    await cardPage.waitForTitleToBeUpdated();

    await expect(cardPage.page.getByTestId('ChecklistTitle')).toHaveText(
      'Release checklist',
    );
  });

  test('hides and shows completed checklist items and persists the setting', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await cardPage.waitForChecked();

    const toggleButton = cardPage.page.getByTestId('ToggleCheckedItemsButton');
    await expect(toggleButton).toHaveText('Hide completed items');
    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCount(1);

    await cardPage.waitForToggleCheckedItems();

    await expect(toggleButton).toHaveText('Show completed items (1)');
    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(
      cardPage.page.getByTestId('AllItemsCompleteMessage'),
    ).toHaveText('Everything in this checklist is complete!');

    await cardPage.page.reload();
    await expect(cardPage.page.getByTestId('CardModalContent')).toBeVisible();
    await expect(toggleButton).toHaveText('Show completed items (1)');
    await expect(cardPage.page.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(
      cardPage.page.getByTestId('AllItemsCompleteMessage'),
    ).toBeVisible();
  });

  test('deletes a checklist in the card modal', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
      { title: 'QA checklist', items: ['Run tests'] },
    ]);

    await expect(cardPage.page.getByTestId('ChecklistContainer')).toHaveCount(
      2,
    );

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistHeader"] [data-testid="DeleteChecklistButton"]',
    );

    await cardPage.page
      .getByTestId('PopoverOptionsContent')
      .getByTestId('DeleteChecklistPopoverButton')
      .click();

    await expect(cardPage.page.getByTestId('ChecklistContainer')).toHaveCount(
      1,
    );
    await expect(cardPage.page.getByTestId('ChecklistTitle')).toHaveText(
      'QA checklist',
    );
  });
});

test.describe('Checklist collapse', () => {
  let cardPage: CardPageChecklists;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPageChecklists(page, request);
  });

  test.describe.configure({ timeout: 60_000 });

  test('swaps the checklist icon for a caret on hover', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = cardPage.firstChecklist();

    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeHidden();

    await checklist.getByTestId('ChecklistToggleButton').hover();

    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeHidden();

    await cardPage.page.mouse.move(0, 0);

    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeHidden();
  });

  test('hides the items and the header actions without moving the title', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = cardPage.firstChecklist();
    const expandedTitle = await cardPage.checklistTitlePlacement(checklist);

    await cardPage.waitForChecklistCollapsed(checklist, true);

    await expect(checklist.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(
      checklist.getByTestId('ChecklistProgressPercentage'),
    ).toBeHidden();
    await expect(checklist.getByTestId('ChecklistHeaderActions')).toBeHidden();

    await cardPage.page.mouse.move(0, 0);
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeHidden();

    expect(await cardPage.checklistTitlePlacement(checklist)).toEqual(
      expandedTitle,
    );

    await cardPage.waitForChecklistCollapsed(checklist, false);
    await expect(checklist.getByTestId('CheckboxLabel')).toHaveText(
      'Deploy to staging',
    );
  });

  test('collapses one checklist without touching its neighbor', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
      { title: 'QA checklist', items: ['Run tests'] },
    ]);

    const launch = cardPage.firstChecklist();
    const qa = cardPage.page.getByTestId('ChecklistContainer').nth(1);

    await cardPage.waitForChecklistCollapsed(launch, true);

    await expect(launch.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(qa.getByTestId('CheckboxLabel')).toHaveText('Run tests');
  });

  test('collapses from the keyboard behind a visible focus ring', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = cardPage.firstChecklist();
    const toggle = checklist.getByTestId('ChecklistToggleButton');

    await cardPage.tabTo(toggle);

    await expect(toggle).toHaveCSS('outline-style', 'solid');
    await expect(toggle).toHaveCSS('outline-color', 'rgb(47, 128, 237)');
    await expect(toggle).toHaveCSS('outline-width', '2px');

    await cardPage.page.keyboard.press('Enter');

    await expect(checklist.getByTestId('CheckboxLabel')).toHaveCount(0);
  });

  test('opens the rename editor from the keyboard', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = cardPage.firstChecklist();
    const title = checklist.getByTestId('ChecklistTitleButton');

    await cardPage.tabTo(title);

    await expect(title).toHaveCSS('outline-style', 'solid');
    await expect(title).toHaveCSS('outline-color', 'rgb(47, 128, 237)');

    await cardPage.page.keyboard.press('Enter');

    await expect(checklist.getByTestId('EditCardTitleInput')).toBeFocused();
  });

  test('persists the collapsed state across a reload', async () => {
    await cardPage.setupWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await cardPage.waitForChecklistCollapsed(cardPage.firstChecklist(), true);

    await cardPage.page.waitForLoadState('networkidle');
    await cardPage.page.reload();
    await expect(cardPage.page.getByTestId('CardModalContent')).toBeVisible();

    const checklist = cardPage.firstChecklist();
    await expect(checklist.getByTestId('ChecklistTitle')).toHaveText(
      'Launch checklist',
    );
    await expect(checklist.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeVisible();
  });
});
