import { expect, type Page } from '@playwright/test';

export async function expectCardCompletionActivity(
  page: Page,
  content: 'marked this card complete' | 'marked this card incomplete',
) {
  const activityColumn = page.getByTestId('CardActivityColumn');
  const toggleButton = activityColumn.getByTestId('HideActivityButton');

  if (await toggleButton.getByText('Show details').isVisible()) {
    await toggleButton.click();
  }

  await expect(async () => {
    await expect(
      activityColumn
        .getByTestId('ActivityCommentContainer')
        .filter({ hasText: content }),
    ).toBeVisible();
  }).toPass();
}
