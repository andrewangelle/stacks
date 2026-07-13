import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from '@playwright/test';
import { expectCardCompletionActivity } from '~test/helpers/expectCardCompletionActivity';
import { expectListCardCount } from '~test/helpers/expectListHeaderCardCount';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Card', () => {
  test('edits the card name', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);
    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
    );

    await page.getByTestId('EditCardTitleInput').fill('Write E2E docs');

    await waitForCardTitleToBeUpdated(page);

    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write E2E docs');
  });

  test('adds a description on a card', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );

    await page
      .getByTestId('DescriptionInput')
      .pressSequentially('Add acceptance criteria.');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardDescriptionText"]',
      '[data-testid="SaveDescriptionButton"]',
    );

    await expect(page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria.',
    );
  });

  test('marks a card complete in the card modal', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    const completionCircle = page
      .getByTestId('CardModalTitleContainer')
      .getByTestId('CardTitleModalTriggerCircle');

    await expect(completionCircle).not.toHaveAttribute('data-completed', '');

    await waitForCardCompleted(page);

    await expectCompletedCheckmark(completionCircle);
    await expectCardCompletionActivity(page, 'marked this card complete');
  });

  test('marks a card incomplete in the card modal', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    const completionCircle = page
      .getByTestId('CardModalTitleContainer')
      .getByTestId('CardTitleModalTriggerCircle');

    await waitForCardCompleted(page);
    await expectCompletedCheckmark(completionCircle);

    await waitForCardIncomplete(page);
    await expectIncompleteCheckmark(completionCircle);
    await expectCardCompletionActivity(page, 'marked this card incomplete');
  });

  test('deletes a card', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="CardActionsContainer"] [data-testid="DeleteCardPopoverTrigger"]',
    );

    await page
      .getByTestId('CardActionsContainer')
      .getByTestId('DeleteChecklistPopoverButton')
      .click();

    await page.goto(`/board/${board.id}`);
    await expectListCardCount(page.getByTestId('ListContainer'), 0);
  });
});

test.describe('Move card', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  test('moves the card to another board and logs a board transfer', async ({
    page,
    request,
  }) => {
    const { source, target, card } = await seedBoardsScenario(request);

    await openMoveMenu(page, source.id, card.id);
    await selectMoveBoard(page, 'Backlog');
    await submitMove(page);

    // The modal closes back onto the source board.
    await expect(page.getByTestId('CardModalContent')).toBeHidden();
    await expect(page).not.toHaveURL(/\/card\//);

    // The card left the source board and landed on the target board.
    await gotoSettled(page, `/board/${source.id}`);
    await expect(
      page.getByTestId('ListCardContainer').filter({ hasText: 'Write docs' }),
    ).toHaveCount(0);
    await gotoSettled(page, `/board/${target.id}`);
    await expect(async () => {
      await expect(
        page.getByTestId('ListCardContainer').filter({ hasText: 'Write docs' }),
      ).toBeVisible();
    }).toPass();

    // The transfer is logged with links to the old and new boards.
    await gotoSettled(page, `/board/${target.id}/card/${card.id}`);
    await expectTransferEntries(page, { from: 'Sprint Board', to: 'Backlog' });
    await expectLinkNavigatesToBoard(page, 'Sprint Board', source.id);
  });

  test('moves the card to another list on the same board and logs a list transfer', async ({
    page,
    request,
  }) => {
    const { board, card } = await seedListsScenario(request);

    await openMoveMenu(page, board.id, card.id);
    await selectMoveList(page, 'Doing');
    await submitMove(page);

    // The move closes the modal back onto the board, with the card now in 'Doing'.
    await expectListOrder(page, 'Doing', ['Write docs', 'Plan sprint']);

    // Reopening the card in-app (no reload) must show the freshly logged transfer,
    // with links to the old and new lists.
    await page
      .getByTestId('CardModalTrigger')
      .filter({ hasText: 'Write docs' })
      .click();
    await waitForCardModal(page);
    await expectTransferEntries(page, { from: 'To Do', to: 'Doing' });
  });

  test('repositions the card within its list without logging a transfer', async ({
    page,
    request,
  }) => {
    const { board, card } = await seedListsScenario(request);

    await openMoveMenu(page, board.id, card.id);
    // Keep the same board and list; only change the position.
    await selectMovePosition(page, '2');
    await submitMove(page);

    // The card stays put in its list...
    await gotoSettled(page, `/board/${board.id}`);
    await expectListOrder(page, 'To Do', ['Write docs']);

    // ...and a same-list reposition records nothing in the feed.
    await gotoSettled(page, `/board/${board.id}/card/${card.id}`);
    const activity = page.getByTestId('CardActivityColumn');
    await expect(activity).toBeVisible();
    await expect(
      activity
        .getByTestId('ActivityCommentContainer')
        .filter({ hasText: 'transferred' }),
    ).toHaveCount(0);
  });

  test('keeps the selected position after a page refresh', async ({
    page,
    request,
  }) => {
    const { source, target, card } = await seedBoardsScenario(request);

    await openMoveMenu(page, source.id, card.id);
    await selectMoveBoard(page, 'Backlog');
    // 'Later' already holds one card, so position 2 places the card last.
    await selectMovePosition(page, '2');
    await submitMove(page);

    await gotoSettled(page, `/board/${target.id}`);
    await expectListOrder(page, 'Later', ['Existing card', 'Write docs']);

    // The reordering survives a full refresh (persisted server-side).
    await page.reload();
    await expectListOrder(page, 'Later', ['Existing card', 'Write docs']);
  });
});

async function waitForCardCompleted(page: Page) {
  const completionCircle = modalCompletionCircle(page);

  return waitForHydratedAction(
    () => completionCircle.click(),
    async () => (await completionCircle.getAttribute('data-completed')) === '',
  );
}

async function waitForCardIncomplete(page: Page) {
  const completionCircle = modalCompletionCircle(page);

  return waitForHydratedAction(
    () => completionCircle.click(),
    async () => (await completionCircle.getAttribute('data-completed')) !== '',
  );
}

function modalCompletionCircle(page: Page) {
  return page
    .getByTestId('CardModalTitleContainer')
    .getByTestId('CardTitleModalTriggerCircle');
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

async function waitForCardTitleToBeUpdated(page: Page) {
  const cardTitle = page
    .getByTestId('CardModalTitleContainer')
    .getByTestId('CardModalTitle')
    .first();

  const trigger = () => page.getByTestId('DescriptionPlaceholder').click();
  const isDone = async () =>
    (await cardTitle.count()) > 0 &&
    (await cardTitle.textContent())?.trim() === 'Write E2E docs';

  return waitForHydratedAction(trigger, isDone);
}

async function waitForCardModal(page: Page) {
  await expect(async () => {
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
  }).toPass();
}

// Firefox/WebKit abort a `page.goto` that starts while the previous page is
// still client-hydrating (its dynamic module imports are in flight), surfacing
// as `NS_BINDING_ABORTED`. Let each navigation settle before the next one, so
// back-to-back navigations after a move don't race with hydration.
async function gotoSettled(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState('networkidle');
}

// Two boards: the source holds the card, the target has a list to receive it.
async function seedBoardsScenario(request: APIRequestContext) {
  await resetDb(request);

  const source = await seedBoard(request, 'Sprint Board');
  const { card } = await seedCard(request, {
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

  return { source, target, card };
}

// One board with two lists: the card lives in 'To Do', 'Doing' receives it.
async function seedListsScenario(request: APIRequestContext) {
  await resetDb(request);

  const board = await seedBoard(request, 'Sprint Board');
  const { card } = await seedCard(request, {
    boardId: board.id,
    listTitle: 'To Do',
    cardTitle: 'Write docs',
  });
  await seedCard(request, {
    boardId: board.id,
    listTitle: 'Doing',
    cardTitle: 'Plan sprint',
  });

  return { board, card };
}

async function openMoveMenu(page: Page, boardId: string, cardId: string) {
  await page.goto(`/board/${boardId}/card/${cardId}`);
  await waitForCardModal(page);

  await page.getByTestId('MoveCardMenuTrigger').click();
  await expect(page.getByTestId('MoveCardMenuContent')).toBeVisible();
}

// The move menu's dropdowns are Radix Selects nested inside a Radix Popover.
// On WebKit (and inconsistently on Firefox), Playwright's synthetic click on a
// Select trigger is seen by the Popover's dismiss layer as an outside pointer
// interaction, so the whole popover closes before the list ever opens. Opening
// the Select with the keyboard avoids the pointer path and keeps the popover
// open across all browsers; the item can then be clicked normally.
async function openSelect(page: Page, triggerTestId: string) {
  const trigger = page.getByTestId(triggerTestId);
  await trigger.focus();
  await trigger.press('Enter');
}

async function selectMoveBoard(page: Page, boardTitle: string) {
  await openSelect(page, 'BoardSelectTrigger');
  await page.getByTestId(`BoardSelectItem-${boardTitle}`).click();
  // The button enables once the selection resolves to a list on the new board.
  await expect(page.getByTestId('MoveCardButton')).toBeEnabled();
}

async function selectMoveList(page: Page, listTitle: string) {
  await openSelect(page, 'ListSelectTrigger');
  await page.getByTestId(`ListSelectItem-${listTitle}`).click();
  await expect(page.getByTestId('MoveCardButton')).toBeEnabled();
}

async function selectMovePosition(page: Page, position: string) {
  await openSelect(page, 'PositionSelectTrigger');
  await page.getByTestId(`PositionSelectItem-${position}`).click();
}

async function submitMove(page: Page) {
  const moveButton = page.getByTestId('MoveCardButton');
  await expect(moveButton).toBeEnabled();
  await moveButton.click();
}

async function expectListOrder(
  page: Page,
  listTitle: string,
  cardTitles: string[],
) {
  const list = page.getByTestId('ListContainer').filter({ hasText: listTitle });
  await expect(async () => {
    const cards = list.getByTestId('ListCardContainer');
    await expect(cards).toHaveCount(cardTitles.length);
    for (let index = 0; index < cardTitles.length; index++) {
      await expect(cards.nth(index)).toContainText(cardTitles[index]);
    }
  }).toPass();
}

async function expectTransferEntries(
  page: Page,
  links: { from: string; to: string },
) {
  const activity = page.getByTestId('CardActivityColumn');
  await expect(
    activity
      .getByTestId('ActivityCommentContainer')
      .filter({ hasText: `transferred this card from ${links.from}` }),
  ).toBeVisible();
  await expect(
    activity
      .getByTestId('ActivityCommentContainer')
      .filter({ hasText: `transferred this card to ${links.to}` }),
  ).toBeVisible();
}

async function expectLinkNavigatesToBoard(
  page: Page,
  linkText: string,
  boardId: string,
) {
  await page
    .getByTestId('CardActivityColumn')
    .getByTestId('ActivityCommentContainer')
    .filter({ hasText: `transferred this card from ${linkText}` })
    .getByText(linkText)
    .click();
  // Board urls are masked to the first 8 characters of the id.
  await expect(page).toHaveURL(new RegExp(`/board/${boardId.slice(0, 8)}`));
}
