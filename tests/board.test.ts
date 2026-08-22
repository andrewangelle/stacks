import { expect, type Page, test } from '@playwright/test';
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

async function openSwitchBoards(page: Page) {
  await waitForInteractiveTrigger(
    page,
    '[data-testid="SwitchBoardsContent"]',
    '[data-testid="SwitchBoardsTrigger"]',
  );

  await expect(page.getByTestId('SwitchBoardsContent')).toBeVisible();
}

test.describe('Display menu', () => {
  test('lists every board except the current one', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const current = await seedBoard(request, 'Experian');
    await seedBoard(request, 'Open Source');
    await seedBoard(request, 'Interview Prep');
    await page.goto(`/board/${current.id}`);

    await expect(page.getByTestId('DisplayMenuBoardButton')).toHaveText(
      'Board',
    );

    await openSwitchBoards(page);

    const titles = page
      .getByTestId('SwitchBoardsGrid')
      .getByTestId('BoardCardTitle');

    await expect(titles).toHaveText(['Open Source', 'Interview Prep']);
  });

  test('filters the boards by the search text', async ({ page, request }) => {
    await resetDb(request);
    const current = await seedBoard(request, 'Experian');
    await seedBoard(request, 'Open Source');
    await seedBoard(request, 'Interview Prep');
    await page.goto(`/board/${current.id}`);

    await openSwitchBoards(page);

    const titles = page
      .getByTestId('SwitchBoardsGrid')
      .getByTestId('BoardCardTitle');

    await page.getByTestId('SwitchBoardsSearchInput').fill('open');
    await expect(titles).toHaveText(['Open Source']);

    await page.getByTestId('SwitchBoardsSearchInput').fill('nothing matches');
    await expect(page.getByTestId('SwitchBoardsGrid')).toHaveCount(0);
    await expect(page.getByTestId('SwitchBoardsEmpty')).toBeVisible();

    await page.getByTestId('SwitchBoardsSearchClear').click();
    await expect(page.getByTestId('SwitchBoardsSearchInput')).toHaveValue('');
    await expect(titles).toHaveText(['Open Source', 'Interview Prep']);
  });

  test('switches to the board that was picked', async ({ page, request }) => {
    await resetDb(request);
    const current = await seedBoard(request, 'Experian');
    const target = await seedBoard(request, 'Open Source');
    await page.goto(`/board/${current.id}`);

    await openSwitchBoards(page);

    await page.getByTestId('SwitchBoardsSearchInput').fill('open');
    await page.getByTestId('SwitchBoardsGrid').getByRole('link').click();

    await expect(page).toHaveURL(`/board/${target.id.slice(0, 8)}`);
    await expect(page.getByTestId('BoardTitle')).toHaveText('Open Source');
    await expect(page.getByTestId('SwitchBoardsContent')).toHaveCount(0);
  });
});
