import { expect, test } from '@playwright/test';
import { BoardPage } from '~test/helpers/BoardPage';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard, seedListCard } from '~test/helpers/seed';

test.describe('List', () => {
  // First navigation in a run can wait on Vite cold-compile; allow extra time.
  test.describe.configure({ timeout: 60_000 });

  let boardPage: BoardPage;

  test.beforeEach(async ({ page, request }) => {
    boardPage = new BoardPage(page, request);
  });

  test('truncates checklists and items on a list card', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [
        {
          title: 'Prep',
          items: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
        },
        { title: 'QA', items: ['Run tests'] },
        { title: 'Docs', items: ['Update readme'] },
        { title: 'Deploy', items: ['Ship to prod'] },
      ],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Launch feature');

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="CardTitleDetailsChecklistDivider"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );

    await expect(
      boardPage.page.getByTestId('CardTitleDetailsChecklistAccordionItem'),
    ).toHaveCount(3);

    await expect(
      boardPage.page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: '...and 1 more' }),
    ).toBeVisible();

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="CardTitleDetailsChecklistItemRow"]',
      '[data-testid="CardTitleDetailsChecklistAccordionTrigger"]',
    );

    await expect(
      boardPage.page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(3);

    await expect(
      boardPage.page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: 'Show more' }),
    ).toBeVisible();

    await boardPage.waitForItemToBeVisible();

    await expect(
      boardPage.page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(5);

    await expect(
      boardPage.page.getByTestId('CardTitleDetailsChecklistItemLabel').filter({
        hasText: 'Step 5',
      }),
    ).toBeVisible();
  });

  test('shows the all tasks completed message when the last checklist item is checked', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [{ title: 'Prep', items: ['Step 1'] }],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Launch feature');

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="CardTitleDetailsChecklistItemRow"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );

    await expect(
      boardPage.page.getByTestId('AllTasksCompletedContainer'),
    ).toHaveCount(0);

    await boardPage.page
      .getByTestId('CardTitleDetailsChecklistCheckbox')
      .first()
      .click();

    await expect(
      boardPage.page.getByTestId('AllTasksCompletedContainer'),
    ).toBeVisible();
    await expect(
      boardPage.page.getByTestId('AllTasksCompletedContainer'),
    ).toContainText('All tasks completed!');
  });

  test('edits the list name', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForList('In Progress');

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="EditListNameInput"]',
      '[data-testid="EditableListName"] [data-testid="ListName"]',
    );

    await boardPage.page
      .getByTestId('EditableListName')
      .getByTestId('EditListNameInput')
      .fill('Done');

    await boardPage.waitForUpdatedListName();

    await boardPage.waitForListAfterReload('Done');
  });

  test('marks a card complete on the list', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard();

    const listCard = boardPage.page.getByTestId('ListCardContainer');
    const completionCircle = boardPage.page.getByTestId(
      'CardTitleModalTriggerCircle',
    );

    await expect(completionCircle).not.toHaveAttribute('data-completed', '');

    await boardPage.waitForCardCompletedOnList();

    await boardPage.expectCompletedCheckmark(completionCircle);
    await expect(listCard).toContainText('Launch feature');

    await boardPage.page.getByTestId('ListCardTitleDetailsContainer').click();
    await boardPage.waitForCardModal();
    await boardPage.expectCardCompletionActivity('marked this card complete');
  });

  test('marks a card incomplete on the list', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard();

    const listCard = boardPage.page.getByTestId('ListCardContainer');
    const completionCircle = boardPage.page.getByTestId(
      'CardTitleModalTriggerCircle',
    );

    await boardPage.waitForCardCompletedOnList();
    await boardPage.expectCompletedCheckmark(completionCircle);

    await boardPage.waitForCardIncompleteOnList();
    await boardPage.expectIncompleteCheckmark(completionCircle);
    await expect(listCard).toContainText('Launch feature');

    await boardPage.page.getByTestId('ListCardTitleDetailsContainer').click();
    await boardPage.waitForCardModal();
    await boardPage.expectCardCompletionActivity('marked this card incomplete');
  });

  test('inserts a card between existing cards', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');
    await seedCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Alpha',
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Alpha');
    await boardPage.expectListCardCount(1);

    await boardPage.addCardAtEnd('Charlie');
    await boardPage.expectListCardCount(2);

    const slot = boardPage.page.getByTestId('AddNewCardAtPosition-0');
    await boardPage.openAddCardAtPosition(slot);

    await slot.getByTestId('AddCardInput').fill('Bravo');
    await slot.getByTestId('AddCardButton').click();

    await boardPage.expectListCardCount(3);

    const cards = boardPage.page.getByTestId('ListCardContainer');
    await expect(cards.nth(0)).toContainText('Alpha');
    await expect(cards.nth(1)).toContainText('Bravo');
    await expect(cards.nth(2)).toContainText('Charlie');
  });

  test('deletes a list', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForList();

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ListContainer"] [data-testid="ListActionsPopoverButton"]',
    );

    await boardPage.waitForHydratedAction(
      async () => {
        await boardPage.page
          .getByTestId('ListActionsOption')
          .filter({ hasText: 'Archive this list' })
          .click();
        await boardPage.page.getByTestId('DeleteListButton').click();
      },
      async () =>
        (await boardPage.page.getByTestId('ListContainer').count()) === 0,
    );
  });

  test('persists the expanded checklist view across reloads', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [{ title: 'Prep', items: ['Step 1', 'Step 2'] }],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Launch feature');

    await expect(
      boardPage.page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(0);

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="CardTitleDetailsChecklistItemRow"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );
    await expect(
      boardPage.page.getByTestId('CardTitleDetailsChecklistItemRow').first(),
    ).toBeVisible();

    await boardPage.waitForExpandedViewAfterReload();
  });

  test('persists which checklist is expanded across reloads', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [
        { title: 'Prep', items: ['Prep step'] },
        { title: 'QA', items: ['Run tests'] },
      ],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Launch feature');

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="CardTitleDetailsChecklistAccordionItem"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );
    await expect(
      boardPage.page.getByTestId('CardTitleDetailsChecklistAccordionItem'),
    ).toHaveCount(2);

    await boardPage.waitForAccordionItemExpanded('QA');
    await boardPage.expectAccordionState('QA', 'open');
    await boardPage.expectAccordionState('Prep', 'closed');

    await boardPage.waitForExpandedAccordionAfterReload('QA', 'Prep');
  });
});

test.describe('Move list', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  let boardPage: BoardPage;

  test.beforeEach(async ({ page, request }) => {
    boardPage = new BoardPage(page, request);
  });

  test('moves a list to another board at the selected position', async () => {
    await resetDb(boardPage.request);

    const source = await seedBoard(boardPage.request, 'Sprint Board');
    await seedCard(boardPage.request, {
      boardId: source.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });

    const target = await seedBoard(boardPage.request, 'Backlog');
    await seedCard(boardPage.request, {
      boardId: target.id,
      listTitle: 'Later',
      cardTitle: 'Existing card',
    });

    await boardPage.gotoSettled(`/board/${source.id}`);
    await boardPage.waitForList('To Do');

    await boardPage.openMoveListMenu('To Do');
    await boardPage.selectMoveListBoard('Backlog');
    await boardPage.selectMoveListPosition('1');
    await boardPage.submitListMove();

    await expect(
      boardPage.page.getByTestId('ListContainer').filter({ hasText: 'To Do' }),
    ).toHaveCount(0);

    await boardPage.gotoSettled(`/board/${target.id}`);
    await boardPage.expectBoardListOrder(['To Do', 'Later']);
    await expect(
      boardPage.page
        .getByTestId('ListContainer')
        .filter({ hasText: 'To Do' })
        .getByTestId('ListCardContainer'),
    ).toContainText('Write docs');
  });

  test('repositions a list within the same board', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');
    await seedCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Alpha',
    });
    await seedCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'Doing',
      cardTitle: 'Bravo',
    });
    await seedCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'Done',
      cardTitle: 'Charlie',
    });

    await boardPage.gotoSettled(`/board/${board.id}`);
    await boardPage.expectBoardListOrder(['To Do', 'Doing', 'Done']);

    await boardPage.openMoveListMenu('To Do');
    await boardPage.selectMoveListPosition('3');
    await boardPage.submitListMove();

    await boardPage.expectBoardListOrder(['Doing', 'Done', 'To Do']);

    await boardPage.page.reload();
    await boardPage.expectBoardListOrder(['Doing', 'Done', 'To Do']);
  });
});

test.describe('Edit card popover', () => {
  test.describe.configure({ timeout: 60_000 });

  let boardPage: BoardPage;

  test.beforeEach(async ({ page, request }) => {
    boardPage = new BoardPage(page, request);
  });

  test('shows the edit trigger on hover and hides it on mouse leave', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    const card = boardPage.page.getByTestId('ListCardContainer');
    const trigger = card.getByTestId('EditCardPopoverTrigger');

    await expect(trigger).not.toHaveAttribute('data-visible', '');

    await boardPage.waitForHydratedAction(
      () => card.hover(),
      async () => (await trigger.getAttribute('data-visible')) !== null,
    );

    await boardPage.page.mouse.move(0, 0);
    await expect(trigger).not.toHaveAttribute('data-visible', '');
  });

  test('opens the popover and shows the title textarea and action options', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    await expect(
      boardPage.page.getByTestId('EditCardTitleTextarea'),
    ).toBeVisible();
    await expect(
      boardPage.page.getByTestId('EditCardTitleTextarea'),
    ).toHaveValue('Edit me');
    await expect(
      boardPage.page.getByTestId('EditCardSaveButton'),
    ).toBeVisible();
    await expect(
      boardPage.page.getByTestId('EditCardPopoverOverlay'),
    ).toBeVisible();

    await expect(
      boardPage.page
        .getByTestId('EditCardActionOption')
        .filter({ hasText: 'Open card' }),
    ).toBeVisible();
    await expect(
      boardPage.page
        .getByTestId('EditCardActionOption')
        .filter({ hasText: 'Move' }),
    ).toBeVisible();
    await expect(
      boardPage.page
        .getByTestId('EditCardActionOption')
        .filter({ hasText: 'Copy link' }),
    ).toBeVisible();
    await expect(
      boardPage.page
        .getByTestId('EditCardActionOption')
        .filter({ hasText: 'Archive' }),
    ).toBeVisible();
  });

  test('does not open the card modal when clicking the edit trigger', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toBeVisible();
    await expect(boardPage.page.getByTestId('CardModalContent')).toHaveCount(0);
  });

  test('renames a card via the edit popover', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    const textarea = boardPage.page.getByTestId('EditCardTitleTextarea');
    await textarea.fill('Renamed card');
    await boardPage.page.getByTestId('EditCardSaveButton').click();

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toHaveCount(0);

    await expect(
      boardPage.page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Renamed card' }),
    ).toBeVisible();

    await boardPage.waitForRenamedCardAfterReload('Renamed card');
  });

  test('renames a card via Enter key', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    const textarea = boardPage.page.getByTestId('EditCardTitleTextarea');
    await textarea.fill('Enter rename');
    await textarea.press('Enter');

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toHaveCount(0);

    await expect(
      boardPage.page
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Enter rename' }),
    ).toBeVisible();
  });

  test('opens the card modal via Open Card action', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    await boardPage.page
      .getByTestId('EditCardActionOption')
      .filter({ hasText: 'Open card' })
      .click();

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toHaveCount(0);
    await boardPage.waitForCardModal();
  });

  test('archives a card via the edit popover', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    const archived = boardPage.waitForServerFnResponse();
    await boardPage.page
      .getByTestId('EditCardActionOption')
      .filter({ hasText: 'Archive' })
      .click();
    await archived;

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toHaveCount(0);
    await boardPage.expectListCardCount(0);
  });

  test('copies the card link and shows a checkmark', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.installClipboardSpy();
    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    await boardPage.page
      .getByTestId('EditCardActionOption')
      .filter({ hasText: 'Copy link' })
      .click();

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toBeVisible();

    const clipboardText = await boardPage.readCopiedText();
    expect(clipboardText).toMatch(/\/card\/[a-f0-9]{8}$/);
  });

  test('closes the popover when clicking the overlay', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();
    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toBeVisible();

    await boardPage.page
      .getByTestId('EditCardPopoverOverlay')
      .click({ force: true });

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toHaveCount(0);
    await expect(
      boardPage.page.getByTestId('EditCardPopoverOverlay'),
    ).toHaveCount(0);
  });

  test('elevates the card above the overlay when the popover is open', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    const card = boardPage.page.getByTestId('ListCardContainer');
    await expect(card).not.toHaveAttribute('data-edit-open', '');

    await boardPage.openEditCardPopover();

    await expect(card).toHaveAttribute('data-edit-open', '');

    await boardPage.page
      .getByTestId('EditCardPopoverOverlay')
      .click({ force: true });
    await expect(card).not.toHaveAttribute('data-edit-open', '');
  });

  test('toggles the move panel open and closed via the Move button', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    await boardPage.page
      .getByTestId('EditCardActionOption')
      .filter({ hasText: 'Move' })
      .click();

    await expect(
      boardPage.page.getByTestId('MoveCardFieldsContainer'),
    ).toBeVisible();
    await expect(
      boardPage.page.getByTestId('EditCardActionsContainer'),
    ).toBeVisible();

    await boardPage.page
      .getByTestId('EditCardActionOption')
      .filter({ hasText: 'Move' })
      .click();

    await expect(
      boardPage.page.getByTestId('MoveCardFieldsContainer'),
    ).toHaveCount(0);
  });

  test('moves a card to another list via the edit popover', async () => {
    await resetDb(boardPage.request);

    const board = await seedBoard(boardPage.request, 'Sprint Board');
    await seedCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Movable card',
    });
    await seedCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'Doing',
      cardTitle: 'Existing',
    });

    await boardPage.page.goto(`/board/${board.id}`);

    const todoList = boardPage.listByTitle('To Do');
    await expect(async () => {
      await expect(
        todoList
          .getByTestId('ListCardContainer')
          .filter({ hasText: 'Movable card' }),
      ).toBeVisible();
    }).toPass();
    const card = todoList.getByTestId('ListCardContainer');

    await card.hover();
    await boardPage.waitForHydratedAction(
      () => card.getByTestId('EditCardPopoverTrigger').click(),
      async () =>
        (await boardPage.page.getByTestId('EditCardPopoverContent').count()) >
        0,
    );

    await boardPage.page
      .getByTestId('EditCardActionOption')
      .filter({ hasText: 'Move' })
      .click();

    await expect(
      boardPage.page.getByTestId('MoveCardFieldsContainer'),
    ).toBeVisible();

    await boardPage.openEditPopoverMoveSelect('List-ComboboxToggleButton');
    await boardPage.page.getByTestId('ComboboxItem-Doing').click();

    const moved = boardPage.waitForServerFnResponse();
    await boardPage.page.getByTestId('MoveCardButton').click();
    await moved;

    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toHaveCount(0);

    const doingList = boardPage.listByTitle('Doing');
    await expect(
      doingList
        .getByTestId('ListCardContainer')
        .filter({ hasText: 'Movable card' }),
    ).toBeVisible();
  });

  test('resets the move panel when the popover is closed and reopened', async () => {
    const { board } = await boardPage.seedEditCardBoard();

    await boardPage.page.goto(`/board/${board.id}`);
    await boardPage.waitForListCard('Edit me');

    await boardPage.openEditCardPopover();

    await boardPage.page
      .getByTestId('EditCardActionOption')
      .filter({ hasText: 'Move' })
      .click();
    await expect(
      boardPage.page.getByTestId('MoveCardFieldsContainer'),
    ).toBeVisible();

    await boardPage.page
      .getByTestId('EditCardPopoverOverlay')
      .click({ force: true });
    await expect(
      boardPage.page.getByTestId('EditCardPopoverContent'),
    ).toHaveCount(0);

    await boardPage.openEditCardPopover();
    await expect(
      boardPage.page.getByTestId('EditCardTitleTextarea'),
    ).toBeVisible();
    await expect(
      boardPage.page.getByTestId('MoveCardFieldsContainer'),
    ).toHaveCount(0);
  });
});
