import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Boards', () => {
  test('shows a seeded board on the boards page', async ({ page, request }) => {
    await resetDb(request);
    await seedBoard(request, 'Test Board');
    await page.goto('/boards');

    await expect(page.getByTestId('BoardCardTitle')).toHaveText('Test Board');
  });

  test('creates a board from the boards page', async ({ page, request }) => {
    await resetDb(request);
    await page.goto('/boards');

    await expect(page.getByTestId('CreateBoardCard')).toBeVisible();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );

    await page.getByTestId('CreateBoardTitleInput').fill('Sprint Planning');
    await page.getByTestId('CreateBoardButton').click();

    await expect(
      page.getByTestId('BoardCardTitle').filter({ hasText: 'Sprint Planning' }),
    ).toBeVisible();
  });
});
