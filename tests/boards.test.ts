import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';
import { waitForPopover } from '~test/helpers/waitForPopover';

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
    await waitForPopover(
      page,
      'CreateBoardPopoverContent',
      '[data-testid="CreateBoardCard"]',
    );

    await page.getByTestId('CreateBoardTitleInput').fill('Sprint Planning');
    await page.getByTestId('CreateBoardButton').click();

    await expect(
      page.getByTestId('BoardCardTitle').filter({ hasText: 'Sprint Planning' }),
    ).toBeVisible();
  });
});
