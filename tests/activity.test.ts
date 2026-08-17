import type { APIRequestContext, Locator, Page } from '@playwright/test';
import { expect, test } from '~test/fixtures';
import { resetDb } from '~test/helpers/resetDb';
import { seedActivities, seedBoard, seedCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Activity', () => {
  test.describe.configure({ timeout: 60_000 });

  test('adds a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    await addComment(page, 'Looks good');
  });

  test('keeps a comment being written while the entries load', async ({
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

    // Deliberately no settling: the entries are still loading, and the panel
    // used to re-suspend once they arrived, tearing down the composer and the
    // draft in it.
    await waitForInteractiveTrigger(
      page,
      '[data-testid="AddCommentInput"]',
      '[data-testid="AddCommentTrigger"]',
    );

    const input = page.getByTestId('AddCommentInput');
    await input.fill('Half-written thought');

    await expect(page.getByTestId('ActivityCommentContent')).toHaveCount(0);
    await page.waitForLoadState('networkidle');

    await expect(input).toHaveText('Half-written thought');
    await expect(
      page.locator('[data-testid="SaveCommentButton"]:not([disabled])'),
    ).toBeVisible();
  });

  test('edits a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    const commentContainer = await addComment(page, 'Looks good');

    await expect(async () => {
      const editInput = commentContainer.getByTestId('AddCommentInput');
      if ((await editInput.count()) > 0) {
        return;
      }

      await commentContainer.getByTestId('EditCommentLink').click();
      await expect(editInput).toBeVisible();
    }).toPass();

    await commentContainer
      .getByTestId('AddCommentInput')
      .fill('Needs revision');

    await waitForSaveButton(commentContainer);

    await expect(
      commentContainer.getByTestId('ActivityCommentContent'),
    ).toHaveText('Needs revision');
  });

  test('deletes a comment in the activity column', async ({
    page,
    request,
  }) => {
    await openCard(page, request);

    await addComment(page, 'Looks good');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ActivityCommentContainer"] [data-testid="DeleteCommentLink"]',
    );

    await page
      .getByTestId('DeleteChecklistPopoverButton')
      .filter({ hasText: /^Delete$/ })
      .click();

    await expect(page.getByTestId('ActivityCommentContent')).toHaveCount(0);
  });
});

test.describe('Activity details toggle', () => {
  test.describe.configure({ timeout: 60_000 });

  test('persists hidden details across a reload', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { list, card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    // Two feed entries, staggered oldest-last. The older one is the card's
    // first entry, which the panel pins in both views, so the newer one is what
    // hiding details actually takes away.
    await seedActivities(request, {
      boardId: board.id,
      listId: list.id,
      cardId: card.id,
      count: 2,
      type: 'feed',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);

    const activityColumn = page.getByTestId('CardActivityColumn');
    const toggleButton = activityColumn.getByTestId('HideActivityButton');
    const newerEntry = activityEntry(page, 'seeded activity 1');
    const firstEntry = activityEntry(page, 'seeded activity 2');

    await expect(toggleButton).toHaveText('Hide details');
    await expect(newerEntry).toBeVisible();

    await hideDetails(page);

    // The toggle is written to the card, so let the mutation reach the server
    // before dropping the optimistic cache on the floor with a reload.
    await page.waitForLoadState('networkidle');
    await page.reload();

    await expect(toggleButton).toHaveText('Show details');
    await expect(newerEntry).toHaveCount(0);
    await expect(firstEntry).toBeVisible();
  });

  test('always shows the card creation entry', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    // Seed the list only. The "added this card" entry is written by the client
    // when a card is created, so the card under test has to be added through
    // the UI to have one at all.
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    await page.goto(`/board/${board.id}`);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="AddCardInput"]',
      '[data-testid="AddCardText"]',
    );
    await page.getByTestId('AddCardInput').fill('Write E2E tests');
    await page.getByTestId('AddCardButton').click();

    const newCard = page
      .getByTestId('ListCardContainer')
      .filter({ hasText: 'Write E2E tests' });

    await expect(newCard).toBeVisible();
    // The creation entry is written by an effect after the card lands, so let
    // it reach the server before the card modal fetches the feed.
    await page.waitForLoadState('networkidle');

    await waitForHydratedAction(
      () => newCard.click(),
      () => page.getByTestId('CardModalContent').isVisible(),
    );

    // A second feed entry, newer than the creation entry, to show that hiding
    // details takes the rest of the feed away and keeps only the pinned one.
    const completionCircle = page
      .getByTestId('CardModalTitleContainer')
      .getByTestId('CardTitleModalTriggerCircle');

    await waitForHydratedAction(
      () => completionCircle.click(),
      async () =>
        (await completionCircle.getAttribute('data-completed')) === '',
    );

    const creationEntry = activityEntry(page, 'added this card');
    const completionEntry = activityEntry(page, 'marked this card complete');

    await expect(creationEntry).toBeVisible();
    await expect(completionEntry).toBeVisible();

    await hideDetails(page);

    await expect(completionEntry).toHaveCount(0);
    await expect(creationEntry).toBeVisible();
  });
});

test.describe('Activity copy link', () => {
  // openCard + addComment on a cold run can exceed the default 30s budget.
  test.describe.configure({ timeout: 60_000 });

  test('shows the paperclip when hovering the timestamp', async ({
    page,
    request,
  }) => {
    await installClipboardSpy(page);
    await openCard(page, request);

    const commentContainer = await addComment(page, 'Looks good');
    const timestamp = commentContainer.getByTestId('CommentTimestamp');
    const paperclip = commentContainer.getByTestId('PaperclipReveal');

    await expect(paperclip).toHaveAttribute('aria-hidden', 'true');

    await timestamp.hover();

    await expect(paperclip).toHaveAttribute('aria-hidden', 'false');

    // Moving away from the timestamp hides it again.
    await commentContainer.getByTestId('ActivityCommentContent').hover();

    await expect(paperclip).toHaveAttribute('aria-hidden', 'true');
  });

  test('copies the activity url and shows the checkmark on click', async ({
    page,
    request,
  }) => {
    await installClipboardSpy(page);
    const { card } = await openCard(page, request);

    const commentContainer = await addComment(page, 'Looks good');

    await commentContainer.getByTestId('CommentTimestamp').click();

    await expect(
      commentContainer.getByTestId('ActivityCopiedCheckmark'),
    ).toBeVisible();

    const copied = await readCopiedText(page);
    expect(copied).toContain(`/card/${card.id.slice(0, 8)}#activity-`);
  });

  test('navigating to the copied url reveals the activity entry', async ({
    page,
    request,
  }) => {
    await installClipboardSpy(page);
    await openCard(page, request);

    const commentContainer = await addComment(page, 'Looks good');

    await commentContainer.getByTestId('CommentTimestamp').click();

    await expect(
      commentContainer.getByTestId('ActivityCopiedCheckmark'),
    ).toBeVisible();

    const copied = await readCopiedText(page);
    expect(copied).not.toEqual('');

    // Visit the copied link directly as a fresh navigation.
    await page.goto(copied);

    const linkedComment = page
      .getByTestId('ActivityContainer')
      .filter({ hasText: 'Looks good' });

    await expect(async () => {
      await expect(
        linkedComment.getByTestId('ActivityCommentContent'),
      ).toBeVisible();
      await expect(linkedComment).toBeInViewport();
    }).toPass();
  });

  test('deep links to an entry beyond the first page of activities', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { list, card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    const activities = await seedActivities(request, {
      boardId: board.id,
      listId: list.id,
      cardId: card.id,
      count: 35,
    });

    // The feed loads ten entries at a time, so the target sits on the third
    // page — the list has to keep paging past the first fetch to reveal it.
    const target = activities[29];

    await page.goto(`/board/${board.id}/card/${card.id}#activity-${target.id}`);

    const linkedComment = page
      .getByTestId('ActivityContainer')
      .filter({ hasText: target.content });

    await expect(async () => {
      await expect(
        linkedComment.getByTestId('ActivityCommentContent'),
      ).toBeVisible();
      await expect(linkedComment).toBeInViewport();
    }).toPass();
  });
});

declare global {
  var __copiedText: string;
}

/**
 * Local utils
 */

async function openCard(page: Page, request: APIRequestContext) {
  await resetDb(request);
  const board = await seedBoard(request, 'Sprint Board');
  const { card } = await seedCard(request, {
    boardId: board.id,
    listTitle: 'To Do',
    cardTitle: 'Ship feature',
  });

  await page.goto(`/board/${board.id}/card/${card.id}`);
  await expect(async () => {
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
    await expect(page.getByTestId('CardActivityColumn')).toBeVisible();
  }).toPass();

  return { board, card };
}

function activityEntry(page: Page, text: string) {
  return page
    .getByTestId('CardActivityColumn')
    .getByTestId('ActivityContainer')
    .filter({ hasText: text });
}

async function hideDetails(page: Page) {
  const toggleButton = page
    .getByTestId('CardActivityColumn')
    .getByTestId('HideActivityButton');

  return waitForHydratedAction(
    () => toggleButton.click(),
    async () => (await toggleButton.textContent()) === 'Show details',
  );
}

async function addComment(page: Page, text: string) {
  const activityColumn = page.getByTestId('CardActivityColumn');
  const input = activityColumn.getByTestId('AddCommentInput');
  const saveButton = activityColumn.locator(
    '[data-testid="SaveCommentButton"]:not([disabled])',
  );
  const commentContent = activityColumn
    .getByTestId('ActivityCommentContent')
    .filter({ hasText: text });

  await waitForInteractiveTrigger(
    page,
    '[data-testid="AddCommentInput"]',
    '[data-testid="AddCommentTrigger"]',
  );

  await expect(input).toBeVisible();

  await waitForHydratedAction(
    async () => {
      // Clearing before typing is what makes this retryable. A fill that lands
      // before React hydrates leaves the text in the DOM only: hydration then
      // initializes React's value tracker to that same text, so re-filling it
      // dispatches no change event, `comment` stays empty and Save never enables.
      // Writing '' first guarantees the next fill is a real change.
      await input.fill('');
      await input.fill(text);
      // Bounded so an un-hydrated form fails this attempt instead of waiting out
      // the whole test on a Save button that will never enable.
      await saveButton.click({ timeout: 5_000 });
    },
    async () => (await commentContent.count()) > 0,
  );

  await expect(commentContent).toBeVisible();

  // Scoped by shape, not by text: the edit test rewrites the content, and a
  // locator filtered on `text` would stop matching the moment it does.
  return activityColumn
    .getByTestId('ActivityContainer')
    .filter({ has: page.getByTestId('ActivityCommentContainer') })
    .first();
}

async function waitForSaveButton(commentContainer: Locator) {
  await expect(async () => {
    const editInput = commentContainer.getByTestId('AddCommentInput');

    if ((await editInput.count()) === 0) {
      return;
    }

    const saveButton = commentContainer.locator(
      '[data-testid="SaveCommentButton"]:not([disabled])',
    );

    if ((await saveButton.count()) > 0) {
      await saveButton.click();
    }

    await expect(editInput).toHaveCount(0);
  }).toPass();
}

// Captures whatever the app writes to the clipboard into window.__copiedText so
// the copy behavior can be asserted without relying on per-browser clipboard
// permissions. Must be installed before the page navigates.
async function installClipboardSpy(page: Page) {
  await page.addInitScript(() => {
    window.__copiedText = '';

    const record = (text: string) => {
      window.__copiedText = text;
    };

    try {
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: (text: string) => {
            record(text);
            return Promise.resolve();
          },
          readText: () => Promise.resolve(window.__copiedText),
        },
      });
    } catch {
      // Clipboard not configurable in this browser; tests fall back to the URL.
    }
  });
}

function readCopiedText(page: Page) {
  return page.evaluate(() => window.__copiedText);
}
