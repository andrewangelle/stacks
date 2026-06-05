import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';

test.describe('Home Page', () => {
  test.beforeEach(async ({ request }) => {
    await resetDb(request);
  });

  test('redirects authenticated user to boards', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/boards$/);
    await expect(page.getByTestId('BoardsContainer')).toBeVisible();
  });
});
