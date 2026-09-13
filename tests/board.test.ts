import { expect, test } from '@playwright/test';
import { BoardPage } from '~test/helpers/BoardPage';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedListCard } from '~test/helpers/seed';

test.describe('Board', () => {
  let boardPage: BoardPage;

  test.beforeEach(async ({ page, request }) => {
    boardPage = new BoardPage(page, request);
  });

  test('adds a list and card on a board', async () => {
    await resetDb(boardPage.request);
    const board = await seedBoard(boardPage.request, 'Product Roadmap');
    await boardPage.page.goto(`/board/${board.id}`);
    await expect(boardPage.page.getByTestId('AddListContainer')).toBeVisible();

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="AddListInput"]',
      '[data-testid="AddListContainer"] button',
    );

    await expect(boardPage.page.getByTestId('AddListInput')).toBeVisible();
    await boardPage.page.getByTestId('AddListInput').fill('To Do');
    await boardPage.page.getByTestId('CreateListButton').click();

    await expect(boardPage.page.getByTestId('ListContainer')).toBeVisible();
    await boardPage.expectListCardCount(0);

    await boardPage.page.getByTestId('AddCardText').click();
    await boardPage.page.getByTestId('AddCardInput').fill('Write E2E tests');
    await boardPage.page.getByTestId('AddCardButton').click();

    await boardPage.expectListCardCount(1);
    await expect(boardPage.page.getByTestId('ListCardContainer')).toHaveText(
      'Write E2E tests',
    );
  });

  test('edits the board name', async () => {
    await resetDb(boardPage.request);
    const board = await seedBoard(boardPage.request, 'Product Roadmap');
    await boardPage.page.goto(`/board/${board.id}`);
    await expect(boardPage.page.getByTestId('BoardTitle')).toHaveText(
      'Product Roadmap',
    );

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="EditBoardTitleInput"]',
      '[data-testid="BoardTitle"]',
    );

    await boardPage.page.getByTestId('EditBoardTitleInput').fill('Q3 Roadmap');

    // click outside to save
    await boardPage.page.getByTestId('AddListContainer').click();

    await expect(boardPage.page.getByTestId('BoardTitle')).toHaveText(
      'Q3 Roadmap',
    );
  });

  test('archives a board and its lists and cards', async () => {
    await resetDb(boardPage.request);
    const board = await seedBoard(boardPage.request, 'Product Roadmap');
    await seedBoard(boardPage.request, 'Open Source');

    await seedListCard(boardPage.request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await boardPage.page.goto(`/board/${board.id}`);
    await expect(boardPage.page.getByTestId('ListContainer')).toBeVisible();

    await boardPage.waitForInteractiveTrigger(
      '[data-testid="BoardMenuOptionsContainer"]',
      '[data-testid="BoardMenuPopoverButton"]',
    );

    await boardPage.waitForHydratedAction(
      async () => {
        await boardPage.page
          .getByTestId('BoardMenuOption')
          .filter({ hasText: 'Archive this board' })
          .click();
        await boardPage.page.getByTestId('DeleteBoardButton').click();
      },
      async () => boardPage.page.url().endsWith('/boards'),
    );

    await expect(boardPage.page.getByTestId('BoardCardTitle')).toHaveText(
      'Open Source',
    );

    // The board is gone from the database, not just from the cache.
    await boardPage.page.reload();
    await expect(boardPage.page.getByTestId('BoardCardTitle')).toHaveText(
      'Open Source',
    );
  });
});

test.describe('Display menu', () => {
  let boardPage: BoardPage;

  test.beforeEach(async ({ page, request }) => {
    boardPage = new BoardPage(page, request);
  });

  test('lists every board except the current one', async () => {
    await resetDb(boardPage.request);
    const current = await seedBoard(boardPage.request, 'Experian');
    await seedBoard(boardPage.request, 'Open Source');
    await seedBoard(boardPage.request, 'Interview Prep');
    await boardPage.page.goto(`/board/${current.id}`);

    await expect(
      boardPage.page.getByTestId('DisplayMenuBoardButton'),
    ).toHaveText('Board');

    await boardPage.openSwitchBoards();

    const titles = boardPage.page
      .getByTestId('SwitchBoardsGrid')
      .getByTestId('BoardCardTitle');

    await expect(titles).toHaveText(['Open Source', 'Interview Prep']);
  });

  test('filters the boards by the search text', async () => {
    await resetDb(boardPage.request);
    const current = await seedBoard(boardPage.request, 'Experian');
    await seedBoard(boardPage.request, 'Open Source');
    await seedBoard(boardPage.request, 'Interview Prep');
    await boardPage.page.goto(`/board/${current.id}`);

    await boardPage.openSwitchBoards();

    const titles = boardPage.page
      .getByTestId('SwitchBoardsGrid')
      .getByTestId('BoardCardTitle');

    await boardPage.page.getByTestId('SwitchBoardsSearchInput').fill('open');
    await expect(titles).toHaveText(['Open Source']);

    await boardPage.page
      .getByTestId('SwitchBoardsSearchInput')
      .fill('nothing matches');
    await expect(boardPage.page.getByTestId('SwitchBoardsGrid')).toHaveCount(0);
    await expect(boardPage.page.getByTestId('SwitchBoardsEmpty')).toBeVisible();

    await boardPage.page.getByTestId('SwitchBoardsSearchClear').click();
    await expect(
      boardPage.page.getByTestId('SwitchBoardsSearchInput'),
    ).toHaveValue('');
    await expect(titles).toHaveText(['Open Source', 'Interview Prep']);
  });

  test('switches to the board that was picked', async () => {
    await resetDb(boardPage.request);
    const current = await seedBoard(boardPage.request, 'Experian');
    const target = await seedBoard(boardPage.request, 'Open Source');
    await boardPage.page.goto(`/board/${current.id}`);

    await boardPage.openSwitchBoards();

    await boardPage.page.getByTestId('SwitchBoardsSearchInput').fill('open');
    await boardPage.page
      .getByTestId('SwitchBoardsGrid')
      .getByRole('link')
      .click();

    await expect(boardPage.page).toHaveURL(`/board/${target.id.slice(0, 8)}`);
    await expect(boardPage.page.getByTestId('BoardTitle')).toHaveText(
      'Open Source',
    );
    await expect(boardPage.page.getByTestId('SwitchBoardsContent')).toHaveCount(
      0,
    );
  });
});
