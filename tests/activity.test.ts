import {
  type APIRequestContext,
  expect,
  type Page,
  test,
} from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

async function openCard(page: Page, request: APIRequestContext) {
  await resetDb(request);
  const board = await seedBoard(request, 'Sprint Board');
  const { card } = await seedCard(request, {
    boardId: board.id,
    listTitle: 'To Do',
    cardTitle: 'Ship feature',
  });

  await page.goto(`/board/${board.id}/card/${card.id}`);
  await expect(page.getByTestId('CardModalContent')).toBeVisible();
  await expect(page.getByTestId('CardActivityColumn')).toBeVisible();

  return { board, card };
}

async function addComment(page: Page, text: string) {
  const activityColumn = page.getByTestId('CardActivityColumn');
  await activityColumn.getByTestId('AddActivityInput').fill(text);
  await activityColumn.getByTestId('SaveCommentButton').click();

  const commentContainer = page.getByTestId('ActivityCommentContainer');
  await expect(
    commentContainer.getByTestId('ActivityCommentContent'),
  ).toHaveText(text);

  return commentContainer;
}

test.describe('Activity', () => {
  test('adds a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    await addComment(page, 'Looks good');
  });

  test('edits a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    const commentContainer = await addComment(page, 'Looks good');

    await commentContainer.getByRole('button', { name: 'Edit' }).click();
    await commentContainer
      .getByTestId('AddActivityInput')
      .fill('Needs revision');
    await commentContainer.getByTestId('SaveCommentButton').click();

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
