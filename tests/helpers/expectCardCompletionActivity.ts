import { expect, type Page } from '@playwright/test';

export async function expectCardCompletionActivity(
  page: Page,
  content: 'marked this card complete' | 'marked this card incomplete',
) {
  const activityColumn = page.getByTestId('CardActivityColumn');

  await activityColumn.getByTestId('HideActivityButton').click();

  await expect(
    activityColumn
      .getByTestId('ActivityCommentContainer')
      .filter({ hasText: content }),
  ).toBeVisible();
}
