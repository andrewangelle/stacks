import { expect, test } from '@playwright/test';

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the main content', async ({ page }) => {
    // Check if the page loads successfully
    await expect(page).toHaveTitle(/Stacks/);
  });
});
