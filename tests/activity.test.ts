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

  await activityColumn.getByTestId('AddCommentInput').fill(text);

  let commentContainerIndex = -1;

  await waitForHydratedAction(
    () =>
      activityColumn
        .locator('[data-testid="SaveCommentButton"]:not([disabled])')
        .click(),
    async () => {
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
    },
  );

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
