import { expect, test } from '~test/fixtures';
import { ChecklistPage } from '~test/helpers/ChecklistPage';

test.describe('Checklist', () => {
  let checklistPage: ChecklistPage;

  test.beforeEach(async ({ page, request }) => {
    checklistPage = new ChecklistPage(page, request);
  });

  test.describe.configure({ timeout: 60_000 });

  test('marks a checklist item complete in the card modal', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checkbox = checklistPage.page.getByTestId('CheckboxRoot');
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked');
    await checklistPage.waitForChecked();
    await expect(checkbox).toHaveAttribute('data-state', 'checked');
    await expect(
      checklistPage.page.getByTestId('ChecklistProgressPercentage'),
    ).toHaveText('100%');
    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCSS(
      'text-decoration',
      /line-through/,
    );
  });

  test('edits a checklist item label in the card modal', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await checklistPage.waitForInteractiveTrigger(
      '[data-testid="EditChecklistItemContainer"]',
      '[data-testid="CheckboxLabel"]',
    );

    const editForm = checklistPage.page.getByTestId(
      'EditChecklistItemContainer',
    );
    await editForm
      .getByTestId('AddChecklistItemInput')
      .fill('Deploy to production');

    await checklistPage.waitForLabelToBeUpdated();

    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveText(
      'Deploy to production',
    );
  });

  test('converts a checklist item to a card in the card modal', async () => {
    const { board } = await checklistPage.openCardWithChecklists([
      {
        title: 'Launch checklist',
        items: ['Deploy to staging', 'Notify team'],
      },
    ]);

    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCount(
      2,
    );

    const firstItem = checklistPage.page
      .getByTestId('ChecklistCheckboxContainer')
      .first();
    await firstItem.getByTestId('ChecklistContentColumn').hover();

    await checklistPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistCheckboxContainer"] [data-testid="ChecklistItemOptionsEllipsis"]',
    );

    await checklistPage.waitForChecklistItemConverted();

    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCount(
      1,
    );
    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveText(
      'Notify team',
    );

    await checklistPage.page.goto(`/board/${board.id}`);

    await checklistPage.expectListCardCount(2);
    await expect(
      checklistPage.page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Deploy to staging' }),
    ).toBeVisible();
    await expect(
      checklistPage.page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Ship feature' }),
    ).toBeVisible();

    await checklistPage.waitForHydratedAction(
      () =>
        checklistPage.page
          .getByTestId('ListCardContainer')
          .filter({ hasText: 'Deploy to staging' })
          .click(),
      () => checklistPage.page.getByTestId('CardModalContent').isVisible(),
    );

    await expect(
      checklistPage.page
        .getByTestId('CardModalTitleContainer')
        .getByTestId('CardModalTitle'),
    ).toHaveText('Deploy to staging');

    const activityColumn = checklistPage.page.getByTestId('CardActivityColumn');
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
    await checklistPage.openCardWithChecklists([
      {
        title: 'Launch checklist',
        items: ['Deploy to staging', 'Notify team'],
      },
    ]);

    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCount(
      2,
    );

    const firstItem = checklistPage.page
      .getByTestId('ChecklistCheckboxContainer')
      .first();
    await firstItem.getByTestId('ChecklistContentColumn').hover();

    await checklistPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistCheckboxContainer"] [data-testid="ChecklistItemOptionsEllipsis"]',
    );

    await checklistPage.page
      .getByTestId('PopoverOptionsContent')
      .getByTestId('DeleteChecklistItemButton')
      .click();

    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCount(
      1,
    );
    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveText(
      'Notify team',
    );
  });

  test('edits the checklist title in the card modal', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await checklistPage.waitForInteractiveTrigger(
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="ChecklistTitle"]',
    );

    await checklistPage.page
      .getByTestId('ChecklistContainer')
      .getByTestId('EditCardTitleInput')
      .fill('Release checklist');

    await checklistPage.waitForTitleToBeUpdated();

    await expect(checklistPage.page.getByTestId('ChecklistTitle')).toHaveText(
      'Release checklist',
    );
  });

  test('hides and shows completed checklist items and persists the setting', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await checklistPage.waitForChecked();

    const toggleButton = checklistPage.page.getByTestId(
      'ToggleCheckedItemsButton',
    );
    await expect(toggleButton).toHaveText('Hide completed items');
    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCount(
      1,
    );

    await checklistPage.waitForToggleCheckedItems();

    await expect(toggleButton).toHaveText('Show completed items (1)');
    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCount(
      0,
    );
    await expect(
      checklistPage.page.getByTestId('AllItemsCompleteMessage'),
    ).toHaveText('Everything in this checklist is complete!');

    await checklistPage.page.reload();
    await expect(
      checklistPage.page.getByTestId('CardModalContent'),
    ).toBeVisible();
    await expect(toggleButton).toHaveText('Show completed items (1)');
    await expect(checklistPage.page.getByTestId('CheckboxLabel')).toHaveCount(
      0,
    );
    await expect(
      checklistPage.page.getByTestId('AllItemsCompleteMessage'),
    ).toBeVisible();
  });

  test('deletes a checklist in the card modal', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
      { title: 'QA checklist', items: ['Run tests'] },
    ]);

    await expect(
      checklistPage.page.getByTestId('ChecklistContainer'),
    ).toHaveCount(2);

    await checklistPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ChecklistHeader"] [data-testid="DeleteChecklistButton"]',
    );

    await checklistPage.page
      .getByTestId('PopoverOptionsContent')
      .getByTestId('DeleteChecklistPopoverButton')
      .click();

    await expect(
      checklistPage.page.getByTestId('ChecklistContainer'),
    ).toHaveCount(1);
    await expect(checklistPage.page.getByTestId('ChecklistTitle')).toHaveText(
      'QA checklist',
    );
  });
});

test.describe('Checklist collapse', () => {
  let checklistPage: ChecklistPage;

  test.beforeEach(async ({ page, request }) => {
    checklistPage = new ChecklistPage(page, request);
  });

  test.describe.configure({ timeout: 60_000 });

  test('swaps the checklist icon for a caret on hover', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = checklistPage.firstChecklist();

    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeHidden();

    await checklist.getByTestId('ChecklistToggleButton').hover();

    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeHidden();

    await checklistPage.page.mouse.move(0, 0);

    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeHidden();
  });

  test('hides the items and the header actions without moving the title', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = checklistPage.firstChecklist();
    const expandedTitle =
      await checklistPage.checklistTitlePlacement(checklist);

    await checklistPage.waitForChecklistCollapsed(checklist, true);

    await expect(checklist.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(
      checklist.getByTestId('ChecklistProgressPercentage'),
    ).toBeHidden();
    await expect(checklist.getByTestId('ChecklistHeaderActions')).toBeHidden();

    await checklistPage.page.mouse.move(0, 0);
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeVisible();
    await expect(checklist.getByTestId('ChecklistCheckIcon')).toBeHidden();

    expect(await checklistPage.checklistTitlePlacement(checklist)).toEqual(
      expandedTitle,
    );

    await checklistPage.waitForChecklistCollapsed(checklist, false);
    await expect(checklist.getByTestId('CheckboxLabel')).toHaveText(
      'Deploy to staging',
    );
  });

  test('collapses one checklist without touching its neighbor', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
      { title: 'QA checklist', items: ['Run tests'] },
    ]);

    const launch = checklistPage.firstChecklist();
    const qa = checklistPage.page.getByTestId('ChecklistContainer').nth(1);

    await checklistPage.waitForChecklistCollapsed(launch, true);

    await expect(launch.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(qa.getByTestId('CheckboxLabel')).toHaveText('Run tests');
  });

  test('collapses from the keyboard behind a visible focus ring', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = checklistPage.firstChecklist();
    const toggle = checklist.getByTestId('ChecklistToggleButton');

    await checklistPage.tabTo(toggle);

    await expect(toggle).toHaveCSS('outline-style', 'solid');
    await expect(toggle).toHaveCSS('outline-color', 'rgb(47, 128, 237)');
    await expect(toggle).toHaveCSS('outline-width', '2px');

    await checklistPage.page.keyboard.press('Enter');

    await expect(checklist.getByTestId('CheckboxLabel')).toHaveCount(0);
  });

  test('opens the rename editor from the keyboard', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    const checklist = checklistPage.firstChecklist();
    const title = checklist.getByTestId('ChecklistTitleButton');

    await checklistPage.tabTo(title);

    await expect(title).toHaveCSS('outline-style', 'solid');
    await expect(title).toHaveCSS('outline-color', 'rgb(47, 128, 237)');

    await checklistPage.page.keyboard.press('Enter');

    await expect(checklist.getByTestId('EditCardTitleInput')).toBeFocused();
  });

  test('persists the collapsed state across a reload', async () => {
    await checklistPage.openCardWithChecklists([
      { title: 'Launch checklist', items: ['Deploy to staging'] },
    ]);

    await checklistPage.waitForChecklistCollapsed(
      checklistPage.firstChecklist(),
      true,
    );

    await checklistPage.page.waitForLoadState('networkidle');
    await checklistPage.page.reload();
    await expect(
      checklistPage.page.getByTestId('CardModalContent'),
    ).toBeVisible();

    const checklist = checklistPage.firstChecklist();
    await expect(checklist.getByTestId('ChecklistTitle')).toHaveText(
      'Launch checklist',
    );
    await expect(checklist.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(checklist.getByTestId('ChecklistCaretIcon')).toBeVisible();
  });
});
