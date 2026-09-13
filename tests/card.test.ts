import { expect, test } from '~test/fixtures';
import { CardPage } from '~test/helpers/CardPage';
import { seedCard } from '~test/helpers/seed';

test.describe('Card', () => {
  let cardPage: CardPage;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPage(page, request);
  });

  test('edits the card name', async () => {
    await cardPage.setup('Write docs');
    await expect(
      cardPage.page
        .getByTestId('CardModalTitleContainer')
        .getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
    );

    await cardPage.page
      .getByTestId('EditCardTitleInput')
      .fill('Write E2E docs');

    await cardPage.waitForCardTitleToBeUpdated();

    await expect(
      cardPage.page
        .getByTestId('CardModalTitleContainer')
        .getByTestId('CardModalTitle'),
    ).toHaveText('Write E2E docs');
  });

  test('adds a description on a card', async () => {
    await cardPage.setup('Write docs');
    await cardPage.waitForCardModal();

    await expect(
      cardPage.page
        .getByTestId('CardModalTitleContainer')
        .getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );

    await cardPage.page
      .getByTestId('DescriptionInput')
      .pressSequentially('Add acceptance criteria.');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="CardDescriptionText"]',
      '[data-testid="SaveDescriptionButton"]',
    );

    await expect(cardPage.page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria.',
    );
  });

  test('formats a description with the rich text toolbar', async () => {
    await cardPage.setup('Write docs');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );

    const editor = cardPage.page.getByTestId('DescriptionInput');

    await editor.pressSequentially('Release checklist');
    await cardPage.selectBlockType('Heading 2');

    await editor.press('End');
    await editor.press('Enter');
    await cardPage.selectBlockType('Bulleted list');
    await editor.pressSequentially('Ship it');

    await cardPage.page.getByTestId('SaveDescriptionButton').click();

    const description = cardPage.page.getByTestId('CardDescriptionText');
    await expect(description.locator('h2')).toHaveText('Release checklist');
    await expect(description.locator('ul li')).toHaveText('Ship it');

    // The formatting has to survive the round trip through the database, not
    // just the editor session that applied it.
    await cardPage.page.reload();
    await cardPage.waitForCardModal();
    await expect(description.locator('h2')).toHaveText('Release checklist');
    await expect(description.locator('ul li')).toHaveText('Ship it');
  });

  test('marks a card complete in the card modal', async () => {
    await cardPage.setup('Ship feature');
    const completionCircle = cardPage.modalCompletionCircle();
    await expect(completionCircle).not.toHaveAttribute('data-completed', '');
    await cardPage.waitForCardCompleted();
    await cardPage.expectCompletedCheckmark();
    await cardPage.expectCardCompletionActivity('marked this card complete');
  });

  test('marks a card incomplete in the card modal', async () => {
    await cardPage.setup('Ship feature');
    await cardPage.waitForCardCompleted();
    await cardPage.expectCompletedCheckmark();
    await cardPage.waitForCardIncomplete();
    await cardPage.expectIncompleteCheckmark();
    await cardPage.expectCardCompletionActivity('marked this card incomplete');
  });

  test('deletes a card', async () => {
    const { board } = await cardPage.setup('Ship feature');
    await cardPage.waitForCardModal();

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="CardActionsContainer"] [data-testid="DeleteCardPopoverTrigger"]',
    );

    await cardPage.page
      .getByTestId('DeleteChecklistPopoverButton')
      .filter({ hasText: /^Delete card$/ })
      .click();

    // Deleting navigates back to the board, but the card only leaves the list
    // once the server confirms. Reloading before that lands cancels the
    // in-flight delete, so wait for it in-app first, then reload to prove the
    // delete persisted.
    await cardPage.expectListCardCount(0);

    await cardPage.page.goto(`/board/${board.id}`);
    await cardPage.expectListCardCount(0);
  });
});

test.describe('Description collapse', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  let cardPage: CardPage;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPage(page, request);
  });

  test('swaps the section icon for a caret on hover', async () => {
    await cardPage.setupWithDescription();

    await expect(
      cardPage.page.getByTestId('DescriptionListIcon'),
    ).toBeVisible();
    await expect(
      cardPage.page.getByTestId('DescriptionCaretIcon'),
    ).toBeHidden();

    await cardPage.page.getByTestId('DescriptionToggleButton').hover();

    await expect(
      cardPage.page.getByTestId('DescriptionCaretIcon'),
    ).toBeVisible();
    await expect(cardPage.page.getByTestId('DescriptionListIcon')).toBeHidden();

    await cardPage.page.mouse.move(0, 0);

    await expect(
      cardPage.page.getByTestId('DescriptionListIcon'),
    ).toBeVisible();
    await expect(
      cardPage.page.getByTestId('DescriptionCaretIcon'),
    ).toBeHidden();
  });

  test('hides the body and the edit button without moving the heading', async () => {
    await cardPage.setupWithDescription();

    const expandedTitle = await cardPage.descriptionTitlePlacement();

    await cardPage.page.getByTestId('DescriptionToggleButton').click();

    await expect(cardPage.page.getByTestId('CardDescriptionText')).toBeHidden();
    await expect(
      cardPage.page.getByTestId('EditDescriptionButton'),
    ).toBeHidden();

    // The caret is the resting face while collapsed, so it survives the pointer
    // leaving the button.
    await cardPage.page.mouse.move(0, 0);
    await expect(
      cardPage.page.getByTestId('DescriptionCaretIcon'),
    ).toBeVisible();
    await expect(cardPage.page.getByTestId('DescriptionListIcon')).toBeHidden();

    // The edit button is hidden in place rather than dropped, which is what
    // keeps the heading row the same box in both states.
    expect(await cardPage.descriptionTitlePlacement()).toEqual(expandedTitle);
  });

  test('slides the body closed and open', async () => {
    await cardPage.setupWithDescription();

    const openHeight = await cardPage.descriptionBodyHeight();
    expect(openHeight).toBeGreaterThan(0);

    const collapse = await cardPage.driveSlide(() =>
      cardPage.page.getByTestId('DescriptionToggleButton').click(),
    );
    cardPage.expectSlide(collapse, { from: openHeight, to: 0 });

    const expand = await cardPage.driveSlide(() =>
      cardPage.page.getByTestId('DescriptionToggleButton').click(),
    );
    cardPage.expectSlide(expand, { from: 0, to: openHeight });
  });

  test('keeps the open editor and its draft across a collapse', async () => {
    await cardPage.setupWithDescription();

    await cardPage.page.getByTestId('EditDescriptionButton').click();
    await cardPage.page.getByTestId('DescriptionInput').click();
    await cardPage.page.keyboard.press('End');
    await cardPage.page
      .getByTestId('DescriptionInput')
      .pressSequentially(' Draft text');
    await expect(cardPage.page.getByTestId('DescriptionInput')).toHaveText(
      'Add acceptance criteria. Draft text',
    );

    await cardPage.page.getByTestId('DescriptionToggleButton').click();
    await expect(cardPage.page.getByTestId('DescriptionInput')).toBeHidden();
    await expect(
      cardPage.page.getByTestId('SaveDescriptionButton'),
    ).toBeHidden();

    await cardPage.page.getByTestId('DescriptionToggleButton').click();
    await expect(cardPage.page.getByTestId('DescriptionInput')).toBeVisible();
    await expect(cardPage.page.getByTestId('DescriptionInput')).toHaveText(
      'Add acceptance criteria. Draft text',
    );

    await cardPage.page.getByTestId('DescriptionInput').click();
    await cardPage.page.keyboard.press('End');
    await cardPage.page
      .getByTestId('DescriptionInput')
      .pressSequentially(' plus more');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="CardDescriptionText"]',
      '[data-testid="SaveDescriptionButton"]',
    );
    await expect(cardPage.page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria. Draft text plus more',
    );
  });

  test('persists the collapsed state across a reload', async () => {
    await cardPage.setupWithDescription();

    await cardPage.page.getByTestId('DescriptionToggleButton').click();
    await expect(cardPage.page.getByTestId('CardDescriptionText')).toBeHidden();

    // The toggle is written to the card, so let the mutation reach the server
    // before dropping the optimistic cache on the floor with a reload.
    await cardPage.page.waitForLoadState('networkidle');
    await cardPage.page.reload();
    await cardPage.waitForCardModal();

    await expect(cardPage.page.getByTestId('CardDescriptionText')).toBeHidden();
    await expect(
      cardPage.page.getByTestId('EditDescriptionButton'),
    ).toBeHidden();

    await cardPage.page.getByTestId('DescriptionToggleButton').click();
    await expect(
      cardPage.page.getByTestId('CardDescriptionText'),
    ).toBeVisible();

    await cardPage.page.waitForLoadState('networkidle');
    await cardPage.page.reload();
    await cardPage.waitForCardModal();

    await expect(
      cardPage.page.getByTestId('CardDescriptionText'),
    ).toBeVisible();
  });
});

test.describe('Description drafts', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  let cardPage: CardPage;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPage(page, request);
  });

  test('selects description text without opening the editor', async () => {
    await cardPage.setupWithDescription();

    const description = cardPage.page.getByTestId('CardDescriptionText');
    const box = await description.boundingBox();

    if (!box) {
      throw new Error('Description has no box to drag across');
    }

    await cardPage.page.mouse.move(box.x + 4, box.y + box.height / 2);
    await cardPage.page.mouse.down();
    await cardPage.page.mouse.move(
      box.x + box.width - 4,
      box.y + box.height / 2,
      { steps: 10 },
    );
    await cardPage.page.mouse.up();

    await expect(cardPage.page.getByTestId('DescriptionInput')).toHaveCount(0);
    expect(await cardPage.selectedText()).not.toBe('');

    await description.click();

    await expect(cardPage.page.getByTestId('DescriptionInput')).toHaveCount(0);
    expect(await cardPage.selectedText()).toBe('');

    await description.click();

    await expect(cardPage.page.getByTestId('DescriptionInput')).toBeVisible();
  });

  test('flags unsaved changes and discards them', async () => {
    await cardPage.setupWithDescription();

    await cardPage.page.getByTestId('EditDescriptionButton').click();

    const editor = cardPage.page.getByTestId('DescriptionInput');
    await expect(editor).toHaveText('Add acceptance criteria.');

    await expect(cardPage.page.getByTestId('UnsavedChangesBadge')).toHaveCount(
      0,
    );
    await expect(
      cardPage.page.getByTestId('CloseDescriptionButton'),
    ).toHaveText('Cancel');

    await editor.click();
    await cardPage.page.keyboard.press('End');
    await editor.pressSequentially(' And a demo.');

    await expect(cardPage.page.getByTestId('UnsavedChangesBadge')).toHaveText(
      'Unsaved changes',
    );
    await expect(
      cardPage.page.getByTestId('CloseDescriptionButton'),
    ).toHaveText('Discard changes');

    await cardPage.page.getByTestId('CloseDescriptionButton').click();

    await expect(editor).toHaveText('Add acceptance criteria.');
    await expect(cardPage.page.getByTestId('UnsavedChangesBadge')).toHaveCount(
      0,
    );
    await expect(
      cardPage.page.getByTestId('CloseDescriptionButton'),
    ).toHaveText('Cancel');

    await cardPage.page.getByTestId('CloseDescriptionButton').click();

    await expect(cardPage.page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria.',
    );
  });

  test('closes the editor on escape and keeps the draft', async () => {
    await cardPage.setupWithDescription();

    await cardPage.page.getByTestId('EditDescriptionButton').click();

    const editor = cardPage.page.getByTestId('DescriptionInput');
    await expect(editor).toHaveText('Add acceptance criteria.');

    await editor.click();
    await cardPage.page.keyboard.press('End');
    await editor.pressSequentially(' And a demo.');
    await expect(
      cardPage.page.getByTestId('UnsavedChangesBadge'),
    ).toBeVisible();

    await cardPage.page.keyboard.press('Escape');

    await expect(editor).toHaveCount(0);
    await expect(cardPage.page.getByTestId('CardModalContent')).toBeVisible();
    await expect(
      cardPage.page.getByTestId('DescriptionToggleButton'),
    ).toBeFocused();

    await expect(
      cardPage.page.getByTestId('UnsavedChangesBadge'),
    ).toBeVisible();
    await expect(cardPage.page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria.',
    );

    await cardPage.page.getByTestId('EditDescriptionButton').click();
    await expect(cardPage.page.getByTestId('DescriptionInput')).toHaveText(
      'Add acceptance criteria. And a demo.',
    );

    await cardPage.page.getByTestId('SaveDescriptionButton').click();

    await expect(cardPage.page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria. And a demo.',
    );
    await expect(cardPage.page.getByTestId('UnsavedChangesBadge')).toHaveCount(
      0,
    );

    await cardPage.page.keyboard.press('Escape');
    await expect(cardPage.page.getByTestId('CardModalContent')).toBeHidden();
  });
});

test.describe('Move card', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  let cardPage: CardPage;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPage(page, request);
  });

  test('moves the card to another board and logs a board transfer', async () => {
    const { source, target, card } = await cardPage.seedBoardsScenario();

    await cardPage.openMoveMenu(source.id, card.id);
    await cardPage.selectMoveBoard('Backlog');
    await cardPage.submitMove();

    await expect(cardPage.page.getByTestId('CardModalContent')).toBeHidden();
    await expect(cardPage.page).not.toHaveURL(/\/card\//);

    await cardPage.gotoSettled(`/board/${source.id}`);

    await expect(
      cardPage.page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Write docs' }),
    ).toHaveCount(0);

    await cardPage.gotoSettled(`/board/${target.id}`);

    await expect(async () => {
      await expect(
        cardPage.page
          .getByTestId('ListCardContainer')
          .filter({ hasText: 'Write docs' }),
      ).toBeVisible();
    }).toPass();

    await cardPage.gotoSettled(`/board/${target.id}/card/${card.id}`);
    await cardPage.expectTransferEntries({
      from: 'Sprint Board',
      to: 'Backlog',
    });
    await cardPage.expectLinkNavigatesToBoard('Sprint Board', source.id);
  });

  test('moves the card to another list on the same board and logs a list transfer', async () => {
    const { board, card } = await cardPage.seedListsScenario();

    await cardPage.openMoveMenu(board.id, card.id);
    await cardPage.selectMoveList('Doing');
    await cardPage.submitMove();

    await cardPage.expectListOrder('Doing', ['Write docs', 'Plan sprint']);

    await cardPage.page
      .getByTestId('CardModalTrigger')
      .filter({ hasText: 'Write docs' })
      .click();
    await cardPage.waitForCardModal();
    await cardPage.expectTransferEntries({ from: 'To Do', to: 'Doing' });
  });

  test('repositions the card within its list without logging a transfer', async () => {
    const { board, card } = await cardPage.seedListsScenario();
    await seedCard(cardPage.request, {
      boardId: board.id,
      listId: card.listId,
      cardTitle: 'Fix bugs',
    });

    await cardPage.openMoveMenu(board.id, card.id);
    await cardPage.selectMovePosition('2');
    await cardPage.submitMove();

    await cardPage.gotoSettled(`/board/${board.id}`);
    await cardPage.expectListOrder('To Do', ['Fix bugs', 'Write docs']);

    await cardPage.gotoSettled(`/board/${board.id}/card/${card.id}`);
    const activity = cardPage.page.getByTestId('CardActivityColumn');
    await expect(activity).toBeVisible();
    await expect(
      activity
        .getByTestId('ActivityCommentContainer')
        .filter({ hasText: 'transferred' }),
    ).toHaveCount(0);
  });

  test('keeps the selected position after a page refresh', async () => {
    const { source, target, card } = await cardPage.seedBoardsScenario();

    await cardPage.openMoveMenu(source.id, card.id);
    await cardPage.selectMoveBoard('Backlog');
    await cardPage.selectMovePosition('2');
    await cardPage.submitMove();

    await cardPage.gotoSettled(`/board/${target.id}`);
    await cardPage.expectListOrder('Later', ['Existing card', 'Write docs']);

    await cardPage.page.reload();
    await cardPage.expectListOrder('Later', ['Existing card', 'Write docs']);
  });

  test('esc closes the move menu without closing the card modal', async () => {
    const { board, card } = await cardPage.seedListsScenario();

    await cardPage.openMoveMenu(board.id, card.id);
    await cardPage.page.keyboard.press('Escape');

    await expect(cardPage.page.getByTestId('MoveCardMenuContent')).toBeHidden();
    await expect(cardPage.page.getByTestId('CardModalContent')).toBeVisible();

    await cardPage.page.keyboard.press('Escape');
    await expect(cardPage.page.getByTestId('CardModalContent')).toBeHidden();
  });
});
