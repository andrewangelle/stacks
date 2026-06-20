import { expect, test } from '@playwright/test';
import { expectListCardCount } from '~test/helpers/expectListHeaderCardCount';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Board', () => {
  test('adds a list and card on a board', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Product Roadmap');
    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('AddListContainer')).toBeVisible();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="AddListInput"]',
      '[data-testid="AddListContainer"] button',
    );

    await expect(page.getByTestId('AddListInput')).toBeVisible();
    await page.getByTestId('AddListInput').fill('To Do');
    await page.getByTestId('CreateListButton').click();

    await expect(page.getByTestId('ListContainer')).toBeVisible();
    await expectListCardCount(page.getByTestId('ListContainer'), 0);

    await page.getByTestId('AddCardText').click();
    await page.getByTestId('AddCardInput').fill('Write E2E tests');
    await page.getByTestId('AddCardButton').click();

    await expectListCardCount(page.getByTestId('ListContainer'), 1);
    await expect(page.getByTestId('ListCardContainer')).toHaveText(
      'Write E2E tests',
    );
  });

  test('edits the board name', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Product Roadmap');
    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('BoardTitle')).toHaveText('Product Roadmap');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="EditBoardTitleInput"]',
      '[data-testid="BoardTitle"]',
    );

    await page.getByTestId('EditBoardTitleInput').fill('Q3 Roadmap');

    // click outside to save
    await page.getByTestId('AddListContainer').click();

    await expect(page.getByTestId('BoardTitle')).toHaveText('Q3 Roadmap');
  });
});
