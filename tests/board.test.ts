import { expect, type Page, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';

function waitForAddListInput(page: Page) {
  // SSR renders the add-list control before React attaches handlers; poll in
  // the page until a click opens the form (headed/UI mode is slower).
  return page.waitForFunction(() => {
    if (document.querySelector('[data-testid="AddListInput"]')) return true;
    const button = document.querySelector(
      '[data-testid="AddListContainer"] button',
    );
    button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    return !!document.querySelector('[data-testid="AddListInput"]');
  });
}

test.describe('Board', () => {
  test('adds a list and card on a board', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Product Roadmap');
    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('AddListContainer')).toBeVisible();

    await waitForAddListInput(page);

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
