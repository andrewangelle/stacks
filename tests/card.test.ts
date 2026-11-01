import { expect, test } from '~test/fixtures';
import { CardPage } from '~test/helpers/CardPage';
import { seedCard, setCommentsVisible } from '~test/helpers/seed';

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

test.describe('Enter to save', () => {
  let cardPage: CardPage;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPage(page, request);
  });

  test('renames the card via Enter in the title input', async () => {
    await cardPage.setup('Write docs');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
    );

    const input = cardPage.page.getByTestId('EditCardTitleInput');
    await input.fill('Write E2E docs');
    const urlBefore = cardPage.page.url();
    await input.press('Enter');

    await expect(input).toHaveCount(0);
    await expect(
      cardPage.page
        .getByTestId('CardModalTitleContainer')
        .getByTestId('CardModalTitle'),
    ).toHaveText('Write E2E docs');
    expect(cardPage.page.url()).toBe(urlBefore);
  });

  test('Enter on a blank card title does nothing', async () => {
    await cardPage.setup('Write docs');

    await cardPage.waitForInteractiveTrigger(
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
    );

    const input = cardPage.page.getByTestId('EditCardTitleInput');
    await input.fill('');
    await input.press('Enter');

    await expect(input).toBeVisible();
    await expect(
      cardPage.page
        .getByTestId('CardModalTitleContainer')
        .getByTestId('CardModalTitle'),
    ).toHaveCount(0);
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

test.describe('Card display menu', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  let cardPage: CardPage;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPage(page, request);
  });

  test.describe('desktop', () => {
    test.skip(({ isMobile }) => isMobile, 'The card menu is desktop-only');

    test('renders a Comments toggle under the card', async () => {
      await cardPage.setup('Write docs');

      const menu = cardPage.page.getByTestId('CardDisplayMenuContainer');
      await expect(menu).toBeVisible();
      await expect(menu.getByTestId('DisplayMenuToggleButton')).toHaveCount(1);
      await expect(cardPage.commentsToggle()).toHaveText('Comments');
      await expect(cardPage.commentsToggle()).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      await expect(menu.getByTestId('DisplayMenuSeperator')).toHaveCount(0);
      await expect(
        cardPage.page.getByTestId('CardActivityColumn'),
      ).toBeVisible();
    });

    test('hides and shows the comments panel', async () => {
      await cardPage.setup('Write docs');
      const activity = cardPage.page.getByTestId('CardActivityColumn');

      await cardPage.toggleComments(true);
      await expect(activity).toBeHidden();

      await cardPage.toggleComments(false);
      await expect(activity).toBeVisible();
    });

    test('keeps comments hidden across a reload, lists and boards', async () => {
      const { board, card, otherBoard, otherBoardCard } =
        await cardPage.seedCommentsScenario();
      const activity = cardPage.page.getByTestId('CardActivityColumn');

      await cardPage.page.goto(`/board/${board.id}/card/${card.id}`);
      await cardPage.waitForCardModal();
      await cardPage.toggleComments(true);

      // The toggle is written to the user, so let it reach the server before a
      // reload drops the optimistic cache.
      await cardPage.page.waitForLoadState('networkidle');
      await cardPage.page.reload();
      await cardPage.waitForCardModal();

      await expect(cardPage.commentsToggle()).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      await expect(activity).toBeHidden();
      // Visibility alone would pass with the column still taking its width;
      // the server-rendered layout has to be collapsed too.
      expect(
        await cardPage.readEdge({
          testId: 'CardActivityColumn',
          edge: 'width',
        }),
      ).toBeLessThan(1);

      await cardPage.closeCardWithEscape();
      await cardPage.openCardFromBoard('Plan sprint');
      await expect(activity).toBeHidden();

      await cardPage.page.goto(
        `/board/${otherBoard.id}/card/${otherBoardCard.id}`,
      );
      await cardPage.waitForCardModal();
      await expect(activity).toBeHidden();
    });

    test('clicking the menu leaves the card open', async () => {
      await cardPage.setup('Write docs');
      const content = cardPage.page.getByTestId('CardModalContent');
      const urlBefore = cardPage.page.url();

      await cardPage.toggleComments(true);
      await expect(content).toBeVisible();
      expect(cardPage.page.url()).toBe(urlBefore);

      await cardPage.toggleComments(false);
      await expect(content).toBeVisible();
      expect(cardPage.page.url()).toBe(urlBefore);

      // The guard is scoped to the menu: the rest of the overlay still closes.
      await cardPage.page.mouse.click(5, 5);
      await expect(content).toBeHidden();
    });

    test('hands the bottom of the screen between the board and card menus', async () => {
      const { board, card } = await cardPage.seedCommentsScenario();
      const boardMenu = cardPage.page.getByTestId('DisplayMenuContainer');
      const cardMenu = cardPage.page.getByTestId('CardDisplayMenuContainer');

      await cardPage.page.goto(`/board/${board.id}`);
      await expect(boardMenu).toBeVisible();

      await cardPage.openCardFromBoard('Write docs');
      await expect(boardMenu).toBeHidden();
      await expect(cardMenu).toBeVisible();

      await cardPage.closeCardWithEscape();
      await expect(boardMenu).toBeVisible();
      await expect(cardMenu).toHaveCount(0);

      await cardPage.page.goto(`/card/${card.id}`);
      await cardPage.waitForCardModal();
      await expect(cardMenu).toBeVisible();

      const reveal = await cardPage.driveTransition(
        { testId: 'DisplayMenuContainer', property: 'transform' },
        { testId: 'DisplayMenuContainer', edge: 'top' },
        () => cardPage.closeCardWithEscape(),
      );
      await expect(boardMenu).toBeVisible();
      await expect(cardMenu).toHaveCount(0);
      expect(reveal.heights[0]).toBeGreaterThan(reveal.end);
    });

    test('paints the board menu without sliding on a reload', async () => {
      const { board, card } = await cardPage.seedCommentsScenario();

      await cardPage.page.addInitScript(() => {
        const runs: string[] = [];
        Object.assign(window, { __boardMenuTransitions: runs });
        document.addEventListener(
          'transitionrun',
          (event) => {
            if (
              event.target instanceof HTMLElement &&
              event.target.dataset.testid === 'DisplayMenuContainer'
            ) {
              runs.push(event.propertyName);
            }
          },
          true,
        );
      });

      await cardPage.page.goto(`/board/${board.id}?from=card-${card.id}`);
      await expect(
        cardPage.page.getByTestId('DisplayMenuContainer'),
      ).toBeVisible();
      await cardPage.page.waitForLoadState('networkidle');

      expect(
        await cardPage.page.evaluate(
          () =>
            (window as Window & { __boardMenuTransitions?: string[] })
              .__boardMenuTransitions,
        ),
      ).toEqual([]);
    });

    test('slides the board menu out and in with the card', async () => {
      const { board } = await cardPage.seedCommentsScenario();
      const boardMenuTop = {
        testId: 'DisplayMenuContainer',
        edge: 'top',
      } as const;
      const boardMenuSlide = {
        testId: 'DisplayMenuContainer',
        property: 'transform',
      };

      await cardPage.page.goto(`/board/${board.id}`);
      await expect(
        cardPage.page.getByTestId('DisplayMenuContainer'),
      ).toBeVisible();
      const shownTop = await cardPage.readEdge(boardMenuTop);

      const hide = await cardPage.driveTransition(
        boardMenuSlide,
        boardMenuTop,
        () => cardPage.openCardFromBoard('Write docs'),
      );
      cardPage.expectSlide(hide, {
        from: shownTop,
        to: cardPage.page.viewportSize()?.height ?? 0,
      });

      const show = await cardPage.driveTransition(
        boardMenuSlide,
        boardMenuTop,
        () => cardPage.closeCardWithEscape(),
      );
      cardPage.expectSlide(show, { from: hide.end, to: shownTop });
    });

    test('slides the card menu up when the card opens', async () => {
      const { board } = await cardPage.seedCommentsScenario();

      await cardPage.page.goto(`/board/${board.id}`);
      const shownTop = await cardPage.readEdge({
        testId: 'DisplayMenuContainer',
        edge: 'top',
      });

      const open = await cardPage.driveTransition(
        { testId: 'CardDisplayMenuContainer', property: 'animation' },
        { testId: 'CardDisplayMenuContainer', edge: 'top' },
        () => cardPage.openCardFromBoard('Write docs'),
      );
      cardPage.expectSlide(open, {
        from: cardPage.page.viewportSize()?.height ?? 0,
        to: shownTop,
      });
    });

    test('slides the comments column closed and open', async () => {
      await cardPage.setup('Write docs');
      const columnWidth = {
        testId: 'CardActivityColumn',
        edge: 'width',
      } as const;
      const columnSlide = {
        testId: 'CardModalBody',
        property: 'grid-template-columns',
      };

      const openWidth = await cardPage.readEdge(columnWidth);
      expect(openWidth).toBeGreaterThan(0);

      const collapse = await cardPage.driveTransition(
        columnSlide,
        columnWidth,
        () => cardPage.toggleComments(true),
      );
      cardPage.expectSlide(collapse, { from: openWidth, to: 0 });

      const expand = await cardPage.driveTransition(
        columnSlide,
        columnWidth,
        () => cardPage.toggleComments(false),
      );
      cardPage.expectSlide(expand, { from: 0, to: openWidth });
    });

    test('narrows the card by the comments column when hiding comments', async () => {
      await cardPage.setup('Write docs');
      const modalWidth = {
        testId: 'CardModalContent',
        edge: 'width',
      } as const;
      const modalSlide = {
        testId: 'CardModalContent',
        property: 'max-width',
      };
      const mainColumnWidth = {
        testId: 'CardMainColumn',
        edge: 'width',
      } as const;

      const openWidth = await cardPage.readEdge(modalWidth);
      const mainWidth = await cardPage.readEdge(mainColumnWidth);
      const handleWidth = await cardPage.readEdge({
        testId: 'ResizeableCardColumnHandle',
        edge: 'width',
      });
      const columnWidth = await cardPage.readEdge({
        testId: 'CardActivityColumn',
        edge: 'width',
      });
      const closedWidth = openWidth - columnWidth - handleWidth;

      const shrink = await cardPage.driveTransition(
        modalSlide,
        modalWidth,
        () => cardPage.toggleComments(true),
      );
      cardPage.expectSlide(shrink, { from: openWidth, to: closedWidth });
      expect(await cardPage.readEdge(mainColumnWidth)).toBeCloseTo(
        mainWidth,
        0,
      );

      // The narrowed card is server-rendered, not shrunk after hydration.
      await cardPage.page.waitForLoadState('networkidle');
      await cardPage.page.reload();
      await cardPage.waitForCardModal();
      expect(await cardPage.readEdge(modalWidth)).toBeCloseTo(closedWidth, 0);

      const grow = await cardPage.driveTransition(modalSlide, modalWidth, () =>
        cardPage.toggleComments(false),
      );
      cardPage.expectSlide(grow, { from: closedWidth, to: openWidth });
      expect(await cardPage.readEdge(mainColumnWidth)).toBeCloseTo(
        mainWidth,
        0,
      );
    });

    test('slides the stacked comments panel closed and open', async () => {
      await cardPage.page.setViewportSize({ width: 800, height: 900 });
      await cardPage.setup('Write docs');
      const innerHeight = {
        testId: 'CardActivityCollapseInner',
        edge: 'height',
      } as const;
      const panelSlide = {
        testId: 'CardActivityCollapse',
        property: 'grid-template-rows',
      };

      await expect(
        cardPage.page.getByTestId('ActivityListViewport'),
      ).toBeAttached();
      const openHeight = await cardPage.readEdge(innerHeight);
      expect(openHeight).toBeGreaterThan(0);

      const collapse = await cardPage.driveTransition(
        panelSlide,
        innerHeight,
        () => cardPage.toggleComments(true),
      );
      cardPage.expectSlide(collapse, { from: openHeight, to: 0 });

      const expand = await cardPage.driveTransition(
        panelSlide,
        innerHeight,
        () => cardPage.toggleComments(false),
      );
      cardPage.expectSlide(expand, { from: 0, to: openHeight });
    });
  });

  test.describe('mobile', () => {
    test.skip(({ isMobile }) => !isMobile, 'Covers the mobile card only');

    test('always shows comments and renders no card menu', async () => {
      const { board, card } = await cardPage.seedCommentsScenario();
      await setCommentsVisible(cardPage.request, false);
      const activity = cardPage.page.getByTestId('CardActivityColumn');
      const cardMenu = cardPage.page.getByTestId('CardDisplayMenuContainer');

      await cardPage.page.goto(`/card/${card.id}`);
      await cardPage.waitForCardModal();
      await expect(activity).toBeVisible();
      await expect(cardMenu).toHaveCount(0);

      await cardPage.page.goto(`/board/${board.id}/card/${card.id}`);
      await cardPage.waitForCardModal();
      await expect(activity).toBeVisible();
      await expect(cardMenu).toHaveCount(0);
      await expect(
        cardPage.page.getByTestId('DisplayMenuContainer'),
      ).toBeVisible();
    });
  });
});
