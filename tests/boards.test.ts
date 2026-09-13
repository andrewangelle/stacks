import { expect, test } from '@playwright/test';
import { BoardsPage } from '~test/helpers/BoardsPage';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';

test.describe('Boards', () => {
  let boardsPage: BoardsPage;

  test.beforeEach(async ({ page, request }) => {
    boardsPage = new BoardsPage(page, request);
  });

  test('shows a seeded board on the boards page', async () => {
    await resetDb(boardsPage.request);
    await seedBoard(boardsPage.request, 'Test Board');
    await boardsPage.page.goto('/boards');

    await expect(boardsPage.page.getByTestId('BoardCardTitle')).toHaveText(
      'Test Board',
    );
  });

  test('creates a board from the boards page', async () => {
    await resetDb(boardsPage.request);
    await boardsPage.page.goto('/boards');

    await expect(boardsPage.page.getByTestId('CreateBoardCard')).toBeVisible();

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );

    await boardsPage.page
      .getByTestId('CreateBoardTitleInput')
      .fill('Sprint Planning');
    await boardsPage.page.getByTestId('CreateBoardButton').click();

    await expect(
      boardsPage.page
        .getByTestId('BoardCardTitle')
        .filter({ hasText: 'Sprint Planning' }),
    ).toBeVisible();
  });
});
