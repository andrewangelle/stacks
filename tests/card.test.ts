import type { APIRequestContext, Page } from '@playwright/test';
import { expect, test } from '~test/fixtures';
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

  test('formats a description with the rich text toolbar', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );

    const editor = page.getByTestId('DescriptionInput');

    await editor.pressSequentially('Release checklist');
    await selectBlockType(page, 'Heading 2');

    await editor.press('End');
    await editor.press('Enter');
    await selectBlockType(page, 'Bulleted list');
    await editor.pressSequentially('Ship it');

    await page.getByTestId('SaveDescriptionButton').click();

    const description = page.getByTestId('CardDescriptionText');
    await expect(description.locator('h2')).toHaveText('Release checklist');
    await expect(description.locator('ul li')).toHaveText('Ship it');

    // The formatting has to survive the round trip through the database, not
    // just the editor session that applied it.
    await page.reload();
    await waitForCardModal(page);
    await expect(description.locator('h2')).toHaveText('Release checklist');
    await expect(description.locator('ul li')).toHaveText('Ship it');
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
      .getByTestId('DeleteChecklistPopoverButton')
      .filter({ hasText: /^Delete card$/ })
      .click();

    // Deleting navigates back to the board, but the card only leaves the list
    // once the server confirms. Reloading before that lands cancels the
    // in-flight delete, so wait for it in-app first, then reload to prove the
    // delete persisted.
    await expectListCardCount(page.getByTestId('ListContainer'), 0);

    await page.goto(`/board/${board.id}`);
    await expectListCardCount(page.getByTestId('ListContainer'), 0);
  });
});

test.describe('Description collapse', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  test('swaps the section icon for a caret on hover', async ({
    page,
    request,
  }) => {
    await openCardWithDescription(page, request);

    await expect(page.getByTestId('DescriptionListIcon')).toBeVisible();
    await expect(page.getByTestId('DescriptionCaretIcon')).toBeHidden();

    await page.getByTestId('DescriptionToggleButton').hover();

    await expect(page.getByTestId('DescriptionCaretIcon')).toBeVisible();
    await expect(page.getByTestId('DescriptionListIcon')).toBeHidden();

    await page.mouse.move(0, 0);

    await expect(page.getByTestId('DescriptionListIcon')).toBeVisible();
    await expect(page.getByTestId('DescriptionCaretIcon')).toBeHidden();
  });

  test('hides the body and the edit button without moving the heading', async ({
    page,
    request,
  }) => {
    await openCardWithDescription(page, request);

    const expandedTitle = await descriptionTitlePlacement(page);

    await page.getByTestId('DescriptionToggleButton').click();

    await expect(page.getByTestId('CardDescriptionText')).toBeHidden();
    await expect(page.getByTestId('EditDescriptionButton')).toBeHidden();

    // The caret is the resting face while collapsed, so it survives the pointer
    // leaving the button.
    await page.mouse.move(0, 0);
    await expect(page.getByTestId('DescriptionCaretIcon')).toBeVisible();
    await expect(page.getByTestId('DescriptionListIcon')).toBeHidden();

    // The edit button is hidden in place rather than dropped, which is what
    // keeps the heading row the same box in both states.
    expect(await descriptionTitlePlacement(page)).toEqual(expandedTitle);
  });

  test('slides the body closed and open', async ({ page, request }) => {
    await openCardWithDescription(page, request);

    const openHeight = await descriptionBodyHeight(page);
    expect(openHeight).toBeGreaterThan(0);

    const collapse = await driveSlide(page, () =>
      page.getByTestId('DescriptionToggleButton').click(),
    );
    expectSlide(collapse, { from: openHeight, to: 0 });

    const expand = await driveSlide(page, () =>
      page.getByTestId('DescriptionToggleButton').click(),
    );
    expectSlide(expand, { from: 0, to: openHeight });
  });

  test('keeps the open editor and its draft across a collapse', async ({
    page,
    request,
  }) => {
    await openCard(page, request);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );
    await page.getByTestId('DescriptionInput').pressSequentially('Draft text');
    await expect(page.getByTestId('DescriptionInput')).toHaveText('Draft text');

    await page.getByTestId('DescriptionToggleButton').click();
    await expect(page.getByTestId('DescriptionInput')).toBeHidden();
    await expect(page.getByTestId('SaveDescriptionButton')).toBeHidden();

    // Lexical seeds itself from `initialValue` on mount, so a collapse that
    // unmounted the editor would silently drop the draft.
    await page.getByTestId('DescriptionToggleButton').click();
    await expect(page.getByTestId('DescriptionInput')).toBeVisible();
    await expect(page.getByTestId('DescriptionInput')).toHaveText('Draft text');

    // Firefox clears the caret when the region is hidden, so re-place it
    // before typing the rest.
    await page.getByTestId('DescriptionInput').click();
    await page.keyboard.press('End');
    await page.getByTestId('DescriptionInput').pressSequentially(' plus more');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardDescriptionText"]',
      '[data-testid="SaveDescriptionButton"]',
    );
    await expect(page.getByTestId('CardDescriptionText')).toHaveText(
      'Draft text plus more',
    );
  });

  test('persists the collapsed state across a reload', async ({
    page,
    request,
  }) => {
    await openCardWithDescription(page, request);

    await page.getByTestId('DescriptionToggleButton').click();
    await expect(page.getByTestId('CardDescriptionText')).toBeHidden();

    // The toggle is written to the card, so let the mutation reach the server
    // before dropping the optimistic cache on the floor with a reload.
    await page.waitForLoadState('networkidle');
    await page.reload();
    await waitForCardModal(page);

    await expect(page.getByTestId('CardDescriptionText')).toBeHidden();
    await expect(page.getByTestId('EditDescriptionButton')).toBeHidden();

    await page.getByTestId('DescriptionToggleButton').click();
    await expect(page.getByTestId('CardDescriptionText')).toBeVisible();

    await page.waitForLoadState('networkidle');
    await page.reload();
    await waitForCardModal(page);

    await expect(page.getByTestId('CardDescriptionText')).toBeVisible();
  });
});

test.describe('Description drafts', () => {
  // Cold Vite compile on the first navigation of a run can exceed 30s.
  test.describe.configure({ timeout: 60_000 });

  test('selects description text without opening the editor', async ({
    page,
    request,
  }) => {
    await openCardWithDescription(page, request);

    const description = page.getByTestId('CardDescriptionText');
    const box = await description.boundingBox();

    if (!box) {
      throw new Error('Description has no box to drag across');
    }

    // Drag across the text the way a user selecting it would. The browser
    // fires a click on mouse up regardless, so the editor has to tell the two
    // gestures apart.
    await page.mouse.move(box.x + 4, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width - 4, box.y + box.height / 2, {
      steps: 10,
    });
    await page.mouse.up();

    await expect(page.getByTestId('DescriptionInput')).toHaveCount(0);
    expect(await selectedText(page)).not.toBe('');

    // The next click is the one that clears the selection, so it still must
    // not open the editor.
    await description.click();

    await expect(page.getByTestId('DescriptionInput')).toHaveCount(0);
    expect(await selectedText(page)).toBe('');

    // With nothing selected, a plain click is a deliberate one.
    await description.click();

    await expect(page.getByTestId('DescriptionInput')).toBeVisible();
  });

  test('flags unsaved changes and discards them', async ({ page, request }) => {
    await openCardWithDescription(page, request);

    await page.getByTestId('EditDescriptionButton').click();

    const editor = page.getByTestId('DescriptionInput');
    await expect(editor).toHaveText('Add acceptance criteria.');

    // An untouched editor is not a draft, so the escape hatch is still Cancel.
    await expect(page.getByTestId('UnsavedChangesBadge')).toHaveCount(0);
    await expect(page.getByTestId('CloseDescriptionButton')).toHaveText(
      'Cancel',
    );

    await editor.click();
    await page.keyboard.press('End');
    await editor.pressSequentially(' And a demo.');

    await expect(page.getByTestId('UnsavedChangesBadge')).toHaveText(
      'Unsaved changes',
    );
    await expect(page.getByTestId('CloseDescriptionButton')).toHaveText(
      'Discard changes',
    );

    await page.getByTestId('CloseDescriptionButton').click();

    // Discarding restores the content the editor opened with and leaves the
    // editor up, so the button falls back to Cancel.
    await expect(editor).toHaveText('Add acceptance criteria.');
    await expect(page.getByTestId('UnsavedChangesBadge')).toHaveCount(0);
    await expect(page.getByTestId('CloseDescriptionButton')).toHaveText(
      'Cancel',
    );

    await page.getByTestId('CloseDescriptionButton').click();

    await expect(page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria.',
    );
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
    // A reposition only means something with a neighbor to move past, so give
    // 'To Do' a second card below 'Write docs'.
    await seedCard(request, {
      boardId: board.id,
      listId: card.listId,
      cardTitle: 'Fix bugs',
    });

    await openMoveMenu(page, board.id, card.id);
    // Keep the same board and list; move 'Write docs' down to position 2.
    await selectMovePosition(page, '2');
    await submitMove(page);

    // The card is reordered within 'To Do' but never leaves it...
    await gotoSettled(page, `/board/${board.id}`);
    await expectListOrder(page, 'To Do', ['Fix bugs', 'Write docs']);

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

  // The menu is a Popover nested inside the card modal's Dialog. Both dismiss on
  // Escape via Radix's shared layer stack, so a duplicate copy of that module
  // splits the stack and lets the keypress tear down the modal too.
  test('esc closes the move menu without closing the card modal', async ({
    page,
    request,
  }) => {
    const { board, card } = await seedListsScenario(request);

    await openMoveMenu(page, board.id, card.id);
    await page.keyboard.press('Escape');

    await expect(page.getByTestId('MoveCardMenuContent')).toBeHidden();
    await expect(page.getByTestId('CardModalContent')).toBeVisible();

    // A second Escape, with only the modal left, still closes it.
    await page.keyboard.press('Escape');
    await expect(page.getByTestId('CardModalContent')).toBeHidden();
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

async function openCard(page: Page, request: APIRequestContext) {
  await resetDb(request);
  const board = await seedBoard(request, 'Sprint Board');
  const { card } = await seedCard(request, {
    boardId: board.id,
    listTitle: 'To Do',
    cardTitle: 'Write docs',
  });

  await page.goto(`/board/${board.id}/card/${card.id}`);
  await waitForCardModal(page);

  return { board, card };
}

/** A card whose description is saved, so the section rests expanded with its
 * edit button and body on screen. */
async function openCardWithDescription(page: Page, request: APIRequestContext) {
  const seeded = await openCard(page, request);

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

  return seeded;
}

function selectedText(page: Page) {
  return page.evaluate(() => window.getSelection()?.toString() ?? '');
}

/**
 * The title's box measured against its heading row, not the viewport: under
 * 850px the modal is `height: auto` inside a `place-items: center` overlay, so
 * collapsing the body shrinks the modal and re-centers everything in it. The
 * claim under test is that the row keeps its box and the title keeps its place
 * in that row.
 */
async function descriptionTitlePlacement(page: Page) {
  const title = await page.getByTestId('DescriptionTitle').boundingBox();
  const row = await page.getByTestId('DescriptionHeadingRow').boundingBox();

  if (!title || !row) {
    throw new Error('Description heading is not on screen');
  }

  return {
    offsetX: title.x - row.x,
    offsetY: title.y - row.y,
    width: title.width,
    height: title.height,
    rowWidth: row.width,
    rowHeight: row.height,
  };
}

async function descriptionBodyHeight(page: Page) {
  const box = await page.getByTestId('DescriptionBodyInner').boundingBox();
  return box?.height ?? 0;
}

/** Fractions of the slide's duration the body height is read at. */
const slideProgress = [0, 0.25, 0.5];

type Slide = {
  /** Body heights at `slideProgress`, in order. */
  heights: number[];
  /** Body height once the transition has run to its end. */
  end: number;
};

/**
 * Runs `act` and reads the body height at fixed points along the resulting
 * slide: take hold of the `grid-template-rows` transition, pause it, and seek
 * its timeline by hand.
 *
 * Sampling the height once per animation frame instead is what this replaced.
 * It reads as the more natural test, but it measures the runner as much as the
 * page — CI's headless WebKit paints about one frame across the whole 150ms
 * transition, so there were no mid-slide frames to find and the test failed
 * there while passing on every local browser. Seeking the animation asks the
 * question frame sampling was trying to ask, with no frame budget to lose.
 */
async function driveSlide(
  page: Page,
  act: () => Promise<void>,
): Promise<Slide> {
  const sliding = page.evaluate((progress) => {
    const body = document.querySelector('[data-testid="DescriptionBody"]');
    const inner = document.querySelector(
      '[data-testid="DescriptionBodyInner"]',
    );

    if (!body || !inner) {
      throw new Error('Description body is not mounted');
    }

    const readHeight = () => inner.getBoundingClientRect().height;

    // Polled rather than driven off `transitionrun`, so the measurement leans
    // on one API instead of two. Catching the slide late costs nothing: it is
    // paused and rewound before anything is read.
    const findSlide = () =>
      body
        .getAnimations()
        .find(
          (candidate) =>
            (candidate as Animation & { transitionProperty?: string })
              .transitionProperty === 'grid-template-rows',
        );

    return new Promise<Slide>((resolve, reject) => {
      const start = performance.now();

      function pollForSlide() {
        const animation = findSlide();

        if (!animation) {
          if (performance.now() - start > 5_000) {
            reject(new Error('grid-template-rows never started transitioning'));
          } else {
            setTimeout(pollForSlide);
          }
          return;
        }

        animation.pause();

        const duration = Number(animation.effect?.getComputedTiming().duration);

        if (!Number.isFinite(duration) || duration <= 0) {
          reject(new Error(`Slide has no duration: ${duration}`));
          return;
        }

        const heights = progress.map((fraction) => {
          animation.currentTime = duration * fraction;
          return readHeight();
        });

        animation.finish();

        resolve({ heights, end: readHeight() });
      }

      pollForSlide();
    });
  }, slideProgress);

  await act();

  return sliding;
}

/**
 * The body leaves `from`, is somewhere strictly between the two resting heights
 * at every point sampled after that, and is still moving the same way each
 * time. A snap would sit on `to` from the first sample on.
 */
function expectSlide(slide: Slide, { from, to }: { from: number; to: number }) {
  expect(slide.heights[0]).toBeCloseTo(from, 0);

  const [low, high] = from < to ? [from, to] : [to, from];

  for (const height of slide.heights.slice(1)) {
    expect(height).toBeGreaterThan(low);
    expect(height).toBeLessThan(high);
  }

  for (const [index, height] of slide.heights.slice(1).entries()) {
    expect(Math.sign(height - slide.heights[index])).toBe(Math.sign(to - from));
  }

  expect(slide.end).toBeCloseTo(to, 0);
}

async function selectBlockType(page: Page, label: string) {
  await page.getByTestId('RichTextBlockSelect').click();
  await page
    .getByTestId('RichTextBlockSelectMenu')
    .getByRole('option', { name: label })
    .click();
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

  await waitForInteractiveTrigger(
    page,
    '[data-testid="MoveCardMenuContent"]',
    '[data-testid="MoveCardMenuTrigger"]',
  );
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
  // Right after a board switch the list/position fields briefly re-render
  // through their loading skeleton, which unmounts the toggle and swallows a
  // single keypress. Retry opening until the combobox actually reports open.
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

async function selectMoveBoard(page: Page, boardTitle: string) {
  await openSelect(page, 'Board-ComboboxToggleButton');
  await page.getByTestId(`ComboboxItem-${boardTitle}`).click();
  // The button enables once the selection resolves to a list on the new board.
  await expect(page.getByTestId('MoveCardButton')).toBeEnabled();
}

async function selectMoveList(page: Page, listTitle: string) {
  await openSelect(page, 'List-ComboboxToggleButton');
  await page.getByTestId(`ComboboxItem-${listTitle}`).click();
  await expect(page.getByTestId('MoveCardButton')).toBeEnabled();
}

async function selectMovePosition(page: Page, position: string) {
  await openSelect(page, 'Position-ComboboxToggleButton');
  await page.getByTestId(`ComboboxItem-${position}`).click();
}

async function submitMove(page: Page) {
  const moveButton = page.getByTestId('MoveCardButton');
  await expect(moveButton).toBeEnabled();
  // The board shows the move optimistically, so nothing on screen marks the
  // write as done. Reloads and hard navigations read from the server, so wait
  // for the move's own response; the waiter is armed before the click so it
  // can't be missed.
  const moved = waitForServerFnResponse(page);
  await moveButton.click();
  await moved;
}

function waitForServerFnResponse(page: Page) {
  return page.waitForResponse(
    (response) =>
      response.url().includes('/_serverFn') &&
      response.request().method() === 'POST',
  );
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
