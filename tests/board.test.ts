import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';
import { waitForPopover } from '~test/helpers/waitForPopover';

test.describe('Board', () => {
  test('adds a list and card on a board', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Product Roadmap');
    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('AddListContainer')).toBeVisible();

    await waitForPopover(
      page,
      'AddListInput',
      '[data-testid="AddListContainer"] button',
    );

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
