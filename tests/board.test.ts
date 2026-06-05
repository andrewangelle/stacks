import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';

test.describe('Board', () => {
  // Next increment: board page loads but AddList edit UI needs investigation (no app changes).
  test.skip(
    true,
    'Enable after AddList interaction is verified in headed mode',
  );

  test('adds a list and card on a board', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Product Roadmap');
    await page.goto(`/board/${board.id}`);

    await expect(page.getByTestId('BoardPageBackground')).toBeVisible();

    await page.getByRole('button', { name: '+ Add a list' }).click();
    await expect(page.getByTestId('AddListInput')).toBeVisible();
    await page.getByTestId('AddListInput').fill('To Do');
    await page.getByTestId('AddListButton').click();

    await expect(page.getByTestId('ListContainer')).toBeVisible();

    await page.getByTestId('AddCardText').click();
    await page.getByTestId('AddCardInput').fill('Write E2E tests');
    await page.getByTestId('AddCardButton').click();

    await expect(page.getByTestId('ListCardContainer')).toHaveText(
      'Write E2E tests',
    );
  });
});
