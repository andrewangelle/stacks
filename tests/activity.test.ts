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
  await activityColumn.getByTestId('AddActivityInput').fill(text);
  await activityColumn.getByTestId('SaveCommentButton').click();

  const commentContainer = activityColumn
    .getByTestId('ActivityCommentContainer')
    .filter({ hasText: text });

  await expect(
    commentContainer.getByTestId('ActivityCommentContent'),
  ).toHaveText(text);

  return commentContainer;
}

async function waitForSaveButton(activityColumn: Locator) {
  const trigger = () =>
    activityColumn
      .locator('[data-testid="SaveCommentButton"]:not([disabled])')
      .click();

  const isDone = async () =>
    (await activityColumn.getByTestId('AddCommentInput').count()) === 0;

  return waitForHydratedAction(trigger, isDone);
}

test.describe('Activity', () => {
  test('adds a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    await addComment(page, 'Looks good');
  });

  test('edits a comment in the activity column', async ({ page, request }) => {
    await openCard(page, request);

    const activityColumn = page.getByTestId('CardActivityColumn');
    await addComment(page, 'Looks good');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="AddCommentInput"]',
      '[data-testid="EditCommentLink"]',
    );

    await activityColumn.getByTestId('AddCommentInput').fill('Needs revision');

    await waitForSaveButton(activityColumn);

    await expect(
      activityColumn
        .getByTestId('ActivityCommentContent')
        .filter({ hasText: 'Needs revision' }),
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
