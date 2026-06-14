import {
  type APIRequestContext,
  expect,
  type Locator,
  type Page,
  test,
} from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Activity', () => {
  test('adds a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    await addComment(page, 'Looks good');
  });

  test('edits a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    const commentContainer = await addComment(page, 'Looks good');

    await waitForHydratedAction(
      () => commentContainer.getByTestId('EditCommentLink').click(),
      async () =>
        (await commentContainer.getByTestId('AddCommentInput').count()) > 0,
    );

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
      '[data-testid="DeleteChecklistPopoverContent"]',
      '[data-testid="ActivityCommentContainer"] [data-testid="DeleteChecklistPopoverTrigger"]',
    );

    await page
      .getByTestId('DeleteChecklistPopoverButton')
      .filter({ hasText: /^Delete$/ })
      .click();

    await expect(page.getByTestId('ActivityCommentContent')).toHaveCount(0);
  });
});

test.describe('Activity copy link', () => {
  test('shows the paperclip when hovering the timestamp', async ({
    page,
    request,
  }) => {
    await installClipboardSpy(page);
    await openCard(page, request);

    const commentContainer = await addComment(page, 'Looks good');
    const timestamp = commentContainer.getByTestId('ActivityTimestamp');
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

    await commentContainer.getByTestId('ActivityTimestamp').click();

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

    await commentContainer.getByTestId('ActivityTimestamp').click();

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
  }).toPass();
  await expect(page.getByTestId('CardActivityColumn')).toBeVisible();

  return { board, card };
}

async function addComment(page: Page, text: string) {
  const activityColumn = page.getByTestId('CardActivityColumn');

  await activityColumn.getByTestId('AddCommentInput').fill(text);

  let commentContainerIndex = -1;

  const trigger = () =>
    activityColumn
      .locator('[data-testid="SaveCommentButton"]:not([disabled])')
      .click();

  async function waitForCommentToBeAdded() {
    const containers = activityColumn.getByTestId('ActivityContainer');
    const count = await containers.count();

    for (let i = 0; i < count; i++) {
      const content = containers.nth(i).getByTestId('ActivityCommentContent');
      if (
        (await content.count()) > 0 &&
        (await content.textContent()) === text
      ) {
        commentContainerIndex = i;
        return true;
      }
    }

    return false;
  }

  await waitForHydratedAction(trigger, waitForCommentToBeAdded);

  return activityColumn
    .getByTestId('ActivityContainer')
    .nth(commentContainerIndex);
}

async function waitForSaveButton(commentContainer: Locator) {
  const trigger = () =>
    commentContainer
      .locator('[data-testid="SaveCommentButton"]:not([disabled])')
      .click();

  const isDone = async () =>
    (await commentContainer.getByTestId('AddCommentInput').count()) === 0;

  return waitForHydratedAction(trigger, isDone);
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
