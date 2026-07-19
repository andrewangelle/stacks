import { expect, type Locator, type Page, test } from '@playwright/test';
import { expectCardCompletionActivity } from '~test/helpers/expectCardCompletionActivity';
import { expectListCardCount } from '~test/helpers/expectListHeaderCardCount';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard, seedListCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('List', () => {
  // First navigation in a run can wait on Vite cold-compile; allow extra time.
  test.describe.configure({ timeout: 60_000 });

  test('truncates checklists and items on a list card', async ({
    page,
    request,
  }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
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

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page, 'Launch feature');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardTitleDetailsChecklistDivider"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );

    await expect(
      page.getByTestId('CardTitleDetailsChecklistAccordionItem'),
    ).toHaveCount(3);

    await expect(
      page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: '...and 1 more' }),
    ).toBeVisible();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardTitleDetailsChecklistItemRow"]',
      '[data-testid="CardTitleDetailsChecklistAccordionTrigger"]',
    );

    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(3);

    await expect(
      page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: 'Show more' }),
    ).toBeVisible();

    await waitForItemToBeVisible(page);

    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(5);

    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemLabel').filter({
        hasText: 'Step 5',
      }),
    ).toBeVisible();
  });

  test('shows the all tasks completed message when the last checklist item is checked', async ({
    page,
    request,
  }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [{ title: 'Prep', items: ['Step 1'] }],
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page, 'Launch feature');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardTitleDetailsChecklistItemRow"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );

    await expect(page.getByTestId('AllTasksCompletedContainer')).toHaveCount(0);

    await page.getByTestId('CardTitleDetailsChecklistCheckbox').first().click();

    await expect(page.getByTestId('AllTasksCompletedContainer')).toBeVisible();
    await expect(page.getByTestId('AllTasksCompletedContainer')).toContainText(
      'All tasks completed!',
    );
  });

  test('edits the list name', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await waitForList(page, 'In Progress');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="EditListNameInput"]',
      '[data-testid="EditableListName"] [data-testid="ListName"]',
    );

    await page
      .getByTestId('EditableListName')
      .getByTestId('EditListNameInput')
      .fill('Done');

    await waitForUpdatedListName(page);

    await waitForListAfterReload(page, 'Done');
  });

  test('marks a card complete on the list', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page);

    const listCard = page.getByTestId('ListCardContainer');
    const completionCircle = page.getByTestId('CardTitleModalTriggerCircle');

    await expect(completionCircle).not.toHaveAttribute('data-completed', '');

    await waitForCardCompletedOnList(page);

    await expectCompletedCheckmark(completionCircle);
    await expect(listCard).toContainText('Launch feature');

    await page.getByTestId('ListCardTitleDetailsContainer').click();
    await waitForCardModal(page);
    await expectCardCompletionActivity(page, 'marked this card complete');
  });

  test('marks a card incomplete on the list', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page);

    const listCard = page.getByTestId('ListCardContainer');
    const completionCircle = page.getByTestId('CardTitleModalTriggerCircle');

    await waitForCardCompletedOnList(page);
    await expectCompletedCheckmark(completionCircle);

    await waitForCardIncompleteOnList(page);
    await expectIncompleteCheckmark(completionCircle);
    await expect(listCard).toContainText('Launch feature');

    await page.getByTestId('ListCardTitleDetailsContainer').click();
    await waitForCardModal(page);
    await expectCardCompletionActivity(page, 'marked this card incomplete');
  });

  test('inserts a card between existing cards', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Alpha',
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page, 'Alpha');
    await expectListCardCount(page.getByTestId('ListContainer'), 1);

    await addCardAtEnd(page, 'Charlie');
    await expectListCardCount(page.getByTestId('ListContainer'), 2);

    const slot = page.getByTestId('AddNewCardAtPosition-0');
    await openAddCardAtPosition(slot);

    await slot.getByTestId('AddCardInput').fill('Bravo');
    await slot.getByTestId('AddCardButton').click();

    await expectListCardCount(page.getByTestId('ListContainer'), 3);

    const cards = page.getByTestId('ListCardContainer');
    await expect(cards.nth(0)).toContainText('Alpha');
    await expect(cards.nth(1)).toContainText('Bravo');
    await expect(cards.nth(2)).toContainText('Charlie');
  });

  test('deletes a list', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await waitForList(page);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ListContainer"] [data-testid="ListActionsPopoverButton"]',
    );

    await waitForHydratedAction(
      async () => {
        await page
          .getByTestId('ListActionsOption')
          .filter({ hasText: 'Archive this list' })
          .click();
        await page.getByTestId('DeleteListButton').click();
      },
      async () => (await page.getByTestId('ListContainer').count()) === 0,
    );
  });

  test('persists the expanded checklist view across reloads', async ({
    page,
    request,
  }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [{ title: 'Prep', items: ['Step 1', 'Step 2'] }],
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page, 'Launch feature');

    // The checklist view starts collapsed.
    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(0);

    // Expand it via the totals trigger — the single checklist's items appear.
    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardTitleDetailsChecklistItemRow"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );
    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow').first(),
    ).toBeVisible();

    // It stays expanded after a reload without re-clicking — persisted state.
    await waitForExpandedViewAfterReload(page);
  });

  test('persists which checklist is expanded across reloads', async ({
    page,
    request,
  }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [
        { title: 'Prep', items: ['Prep step'] },
        { title: 'QA', items: ['Run tests'] },
      ],
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page, 'Launch feature');

    // Expand the checklist view — the accordion of both checklists appears.
    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardTitleDetailsChecklistAccordionItem"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );
    await expect(
      page.getByTestId('CardTitleDetailsChecklistAccordionItem'),
    ).toHaveCount(2);

    // Expand the QA checklist specifically.
    await waitForAccordionItemExpanded(page, 'QA');
    await expectAccordionState(page, 'QA', 'open');
    await expectAccordionState(page, 'Prep', 'closed');

    // After a reload, QA is still the expanded one — persisted selection.
    await waitForExpandedAccordionAfterReload(page, 'QA', 'Prep');
  });
});

test.describe('Move list', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  test('moves a list to another board at the selected position', async ({
    page,
    request,
  }) => {
    await resetDb(request);

    const source = await seedBoard(request, 'Sprint Board');
    await seedCard(request, {
      boardId: source.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });

    const target = await seedBoard(request, 'Backlog');
    await seedCard(request, {
      boardId: target.id,
      listTitle: 'Later',
      cardTitle: 'Existing card',
    });

    await gotoSettled(page, `/board/${source.id}`);
    await waitForList(page, 'To Do');

    await openMoveListMenu(page, 'To Do');
    await selectMoveListBoard(page, 'Backlog');
    await selectMoveListPosition(page, '1');
    await submitListMove(page);

    // The list leaves the source board (no refetch — the optimistic update drops it).
    await expect(
      page.getByTestId('ListContainer').filter({ hasText: 'To Do' }),
    ).toHaveCount(0);

    // It lands on the target board, ahead of the existing list, carrying its card.
    await gotoSettled(page, `/board/${target.id}`);
    await expectBoardListOrder(page, ['To Do', 'Later']);
    await expect(
      page
        .getByTestId('ListContainer')
        .filter({ hasText: 'To Do' })
        .getByTestId('ListCardContainer'),
    ).toContainText('Write docs');
  });

  test('repositions a list within the same board', async ({
    page,
    request,
  }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Alpha',
    });
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'Doing',
      cardTitle: 'Bravo',
    });
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'Done',
      cardTitle: 'Charlie',
    });

    await gotoSettled(page, `/board/${board.id}`);
    await expectBoardListOrder(page, ['To Do', 'Doing', 'Done']);

    // Move 'To Do' from the first slot to the last.
    await openMoveListMenu(page, 'To Do');
    await selectMoveListPosition(page, '3');
    await submitListMove(page);

    await expectBoardListOrder(page, ['Doing', 'Done', 'To Do']);

    // The new order survives a full refresh (persisted server-side).
    await page.reload();
    await expectBoardListOrder(page, ['Doing', 'Done', 'To Do']);
  });
});

/**
 * Local utils
 */
async function addCardAtEnd(page: Page, cardTitle: string) {
  await waitForInteractiveTrigger(
    page,
    '[data-testid="AddCardInput"]',
    '[data-testid="AddCardText"]',
  );

  await page.getByTestId('AddCardInput').fill(cardTitle);
  await page.getByTestId('AddCardButton').click();

  await expect(
    page.getByTestId('ListCardContainer').filter({ hasText: cardTitle }),
  ).toBeVisible();
}

async function openAddCardAtPosition(slot: Locator) {
  await slot.hover();

  return waitForHydratedAction(
    () => slot.getByTestId('AddNewCardAtPositionPlus').click(),
    async () => (await slot.getByTestId('AddCardInput').count()) > 0,
  );
}

async function waitForCardCompletedOnList(page: Page) {
  return waitForCardCompletionOnList(page, true);
}

async function waitForCardIncompleteOnList(page: Page) {
  return waitForCardCompletionOnList(page, false);
}

async function waitForCardCompletionOnList(page: Page, completed: boolean) {
  const listCard = page.getByTestId('ListCardContainer');
  const completionCircle = page.getByTestId('CardTitleModalTriggerCircle');

  return waitForHydratedAction(
    async () => {
      await listCard.hover();
      await completionCircle.click();
    },
    async () => {
      const isCompleted =
        (await completionCircle.getAttribute('data-completed')) === '';
      return completed ? isCompleted : !isCompleted;
    },
  );
}

async function expectCompletedCheckmark(
  completionCircle: ReturnType<Page['getByTestId']>,
) {
  await expect(completionCircle).toHaveAttribute('data-completed', '');
  await expect(
    completionCircle.getByTestId('CardCompletedIndicatorCheckmark'),
  ).toBeVisible();
}

async function expectIncompleteCheckmark(
  completionCircle: ReturnType<Page['getByTestId']>,
) {
  await expect(completionCircle).not.toHaveAttribute('data-completed', '');
  await expect(
    completionCircle.getByTestId('CardCompletedIndicatorCheckmark'),
  ).toHaveCount(0);
}

async function waitForUpdatedListName(page: Page) {
  const trigger = () => page.getByTestId('BoardTitle').click();
  const isUpdated = async () =>
    (await page
      .getByTestId('EditableListName')
      .getByTestId('EditListNameInput')
      .count()) === 0;

  return waitForHydratedAction(trigger, isUpdated);
}

async function waitForItemToBeVisible(page: Page) {
  const trigger = () =>
    page
      .getByTestId('CardTitleDetailsChecklistShowMore')
      .filter({ hasText: 'Show more' })
      .first()
      .click();

  const isVisible = async () =>
    (await page.getByTestId('CardTitleDetailsChecklistItemRow').count()) >= 5;

  return waitForHydratedAction(trigger, isVisible);
}

async function waitForList(page: Page, listTitle?: string) {
  await expect(async () => {
    await expect(page.getByTestId('ListContainer')).toBeVisible();
    if (listTitle) {
      await expect(page.getByTestId('ListName')).toHaveText(listTitle);
    }
  }).toPass();
}

// A single reload can race the rename mutation's persistence to the
// backend — the client shows the new name optimistically before the write
// lands, so one reload can still serve the pre-rename value. Re-reload
// (not just re-check) until the persisted value shows up.
async function waitForListAfterReload(page: Page, listTitle: string) {
  await expect(async () => {
    await page.reload();
    await expect(page.getByTestId('ListName')).toHaveText(listTitle, {
      timeout: 5_000,
    });
  }).toPass();
}

function accordionItem(page: Page, title: string) {
  return page
    .getByTestId('CardTitleDetailsChecklistAccordionItem')
    .filter({ hasText: title });
}

function expectAccordionState(
  page: Page,
  title: string,
  state: 'open' | 'closed',
) {
  return expect(accordionItem(page, title)).toHaveAttribute(
    'data-state',
    state,
  );
}

async function waitForAccordionItemExpanded(page: Page, title: string) {
  const item = accordionItem(page, title);
  const trigger = () =>
    item.getByTestId('CardTitleDetailsChecklistAccordionTrigger').click();
  const isOpen = async () => (await item.getAttribute('data-state')) === 'open';

  return waitForHydratedAction(trigger, isOpen);
}

// A reload can race the persistence of the expand mutation (the client shows
// the expanded state optimistically before the write lands), so re-reload
// until the persisted state serves through.
async function waitForExpandedViewAfterReload(page: Page) {
  await expect(async () => {
    await page.reload();
    await waitForListCard(page);
    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow').first(),
    ).toBeVisible({ timeout: 5_000 });
  }).toPass();
}

async function waitForExpandedAccordionAfterReload(
  page: Page,
  openTitle: string,
  closedTitle: string,
) {
  await expect(async () => {
    await page.reload();
    await waitForListCard(page);
    await expect(accordionItem(page, openTitle)).toHaveAttribute(
      'data-state',
      'open',
      { timeout: 5_000 },
    );
    await expect(accordionItem(page, closedTitle)).toHaveAttribute(
      'data-state',
      'closed',
      { timeout: 5_000 },
    );
  }).toPass();
}

async function waitForListCard(page: Page, cardTitle?: string) {
  await expect(async () => {
    await expect(page.getByTestId('ListContainer')).toBeVisible();
    const listCard = page.getByTestId('ListCardContainer');
    await expect(listCard).toBeVisible();
    if (cardTitle) {
      await expect(listCard).toContainText(cardTitle);
    }
  }).toPass();
}

async function waitForCardModal(page: Page) {
  await expect(async () => {
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
  }).toPass();
}

// Firefox/WebKit abort a `page.goto` that starts while the previous page is still
// client-hydrating, surfacing as `NS_BINDING_ABORTED`. Let each navigation settle
// before the next so back-to-back navigations don't race with hydration.
async function gotoSettled(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

async function openMoveListMenu(page: Page, listTitle: string) {
  const list = page.getByTestId('ListContainer').filter({ hasText: listTitle });
  const trigger = list.getByTestId('ListActionsPopoverButton');

  await waitForHydratedAction(
    () => trigger.click(),
    async () =>
      (await page.getByTestId('ListActionsOptionsContainer').count()) > 0,
  );

  await page
    .getByTestId('ListActionsOption')
    .filter({ hasText: 'Move list' })
    .click();
  await expect(page.getByTestId('MoveListFieldsContainer')).toBeVisible();
}

// The move menu's dropdowns are Radix-triggered comboboxes nested inside a Radix
// Popover. On WebKit (and inconsistently on Firefox), a synthetic click on the
// toggle reads as an outside pointer interaction that dismisses the popover, so
// open the combobox with the keyboard instead; the item can then be clicked.
async function openSelect(page: Page, triggerTestId: string) {
  const trigger = page.getByTestId(triggerTestId);
  await expect(async () => {
    if ((await trigger.getAttribute('aria-expanded')) !== 'true') {
      await trigger.focus();
      await trigger.press('Space');
    }
    await expect(trigger).toHaveAttribute('aria-expanded', 'true', {
      timeout: 1000,
    });
  }).toPass();
}

async function selectMoveListBoard(page: Page, boardTitle: string) {
  await openSelect(page, 'Board-ComboboxToggleButton');
  await page.getByTestId(`ComboboxItem-${boardTitle}`).click();
  await expect(page.getByTestId('MoveListButton')).toBeEnabled();
}

async function selectMoveListPosition(page: Page, position: string) {
  await openSelect(page, 'Position-ComboboxToggleButton');
  await page.getByTestId(`ComboboxItem-${position}`).click();
}

async function submitListMove(page: Page) {
  const moveButton = page.getByTestId('MoveListButton');
  await expect(moveButton).toBeEnabled();
  // The popover closes when the mutation is fired, not when it lands, and the
  // board shows the move optimistically — so nothing on screen marks the write
  // as done. Reloads and hard navigations read from the server, so wait for the
  // move's own response; the waiter is armed before the click so it can't be
  // missed.
  const moved = waitForServerFnResponse(page);
  await moveButton.click();
  await moved;
  await expect(page.getByTestId('MoveListFieldsContainer')).toBeHidden();
}

function waitForServerFnResponse(page: Page) {
  return page.waitForResponse(
    (response) =>
      response.url().includes('/_serverFn') &&
      response.request().method() === 'POST',
  );
}

async function expectBoardListOrder(page: Page, titles: string[]) {
  await expect(async () => {
    const names = page.getByTestId('ListName');
    await expect(names).toHaveCount(titles.length);
    for (let index = 0; index < titles.length; index++) {
      await expect(names.nth(index)).toHaveText(titles[index]);
    }
  }).toPass();
}
