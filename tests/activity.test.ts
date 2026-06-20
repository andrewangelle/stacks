import {
  type APIRequestContext,
  expect,
  type Locator,
  type Page,
  test,
} from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Activity', () => {
  test.describe.configure({ timeout: 60_000 });

  test('adds a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    await addComment(page, 'Looks good');
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

async function addComment(page: Page, text: string) {
  const activityColumn = page.getByTestId('CardActivityColumn');
  const commentContent = activityColumn
    .getByTestId('ActivityCommentContent')
    .filter({ hasText: text });
  let commentIndex = -1;

  await expect(async () => {
    const input = activityColumn.getByTestId('AddCommentInput');
    await expect(input).toBeVisible();
    await input.fill(text);
    await expect(
      activityColumn.locator(
        '[data-testid="SaveCommentButton"]:not([disabled])',
      ),
    ).toBeVisible();
  }).toPass();

  await expect(async () => {
    if ((await commentContent.count()) > 0) {
      const containers = activityColumn.getByTestId('ActivityContainer');
      const count = await containers.count();

      for (let i = 0; i < count; i++) {
        if (
          (await containers
            .nth(i)
            .getByTestId('ActivityCommentContent')
            .filter({ hasText: text })
            .count()) > 0
        ) {
          commentIndex = i;
          return;
        }
      }
    }

    const saveButton = activityColumn.locator(
      '[data-testid="SaveCommentButton"]:not([disabled])',
    );

    if ((await saveButton.count()) > 0) {
      await saveButton.click();
    }

    await expect(commentContent).toBeVisible();

    const containers = activityColumn.getByTestId('ActivityContainer');
    const count = await containers.count();

    for (let i = 0; i < count; i++) {
      if (
        (await containers
          .nth(i)
          .getByTestId('ActivityCommentContent')
          .filter({ hasText: text })
          .count()) > 0
      ) {
        commentIndex = i;
        return;
      }
    }
  }).toPass();

  return activityColumn.getByTestId('ActivityContainer').nth(commentIndex);
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
