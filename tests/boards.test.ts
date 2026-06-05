import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';

test.describe('Boards', () => {
  test('shows a seeded board on the boards page', async ({ page, request }) => {
    await resetDb(request);
    await seedBoard(request, 'Test Board');
    await page.goto('/boards');

    await expect(page.getByTestId('BoardCardTitle')).toHaveText('Test Board');
  });
});
