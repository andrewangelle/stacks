import { expect, test } from '@playwright/test';
import { BasePage } from '~test/helpers/BasePage';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard } from '~test/helpers/seed';

test.describe('Boards', () => {
  let boardsPage: BasePage;

  test.beforeEach(async ({ page, request }) => {
    boardsPage = new BasePage(page, request);
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
    await expect(
      boardsPage.page.getByTestId('CreateBoardPopoverContent'),
    ).toHaveCount(0);

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );
    await expect(
      boardsPage.page.getByTestId('CreateBoardTitleInput'),
    ).toHaveValue('');
  });

  test('closes the create-board popover on Escape and resets its fields', async () => {
    await resetDb(boardsPage.request);
    await boardsPage.page.goto('/boards');

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );

    await boardsPage.page
      .getByTestId('CreateBoardTitleInput')
      .fill('Draft title');
    await boardsPage.page
      .getByTestId('CreateBoardBackgroundChoice')
      .nth(0)
      .click();

    await boardsPage.page.keyboard.press('Escape');
    await expect(
      boardsPage.page.getByTestId('CreateBoardPopoverContent'),
    ).toHaveCount(0);

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );
    await expect(
      boardsPage.page.getByTestId('CreateBoardTitleInput'),
    ).toHaveValue('');
  });

  test('closes the create-board popover on an outside click and resets its fields', async () => {
    await resetDb(boardsPage.request);
    await boardsPage.page.goto('/boards');

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );

    await boardsPage.page
      .getByTestId('CreateBoardTitleInput')
      .fill('Draft title');

    await boardsPage.page.mouse.click(900, 650);
    await expect(
      boardsPage.page.getByTestId('CreateBoardPopoverContent'),
    ).toHaveCount(0);

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );
    await expect(
      boardsPage.page.getByTestId('CreateBoardTitleInput'),
    ).toHaveValue('');
  });
});

test.describe('Enter to save', () => {
  let boardsPage: BasePage;

  test.beforeEach(async ({ page, request }) => {
    boardsPage = new BasePage(page, request);
  });

  test('creates a board via Enter in the title input', async () => {
    await resetDb(boardsPage.request);
    await boardsPage.page.goto('/boards');

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );

    const input = boardsPage.page.getByTestId('CreateBoardTitleInput');
    await input.fill('Sprint Planning');
    await input.press('Enter');

    await expect(
      boardsPage.page
        .getByTestId('BoardCardTitle')
        .filter({ hasText: 'Sprint Planning' }),
    ).toBeVisible();
    await expect(
      boardsPage.page.getByTestId('CreateBoardPopoverContent'),
    ).toHaveCount(0);
  });

  test('Enter on a blank create-board title does nothing', async () => {
    await resetDb(boardsPage.request);
    await boardsPage.page.goto('/boards');

    await boardsPage.waitForInteractiveTrigger(
      '[data-testid="CreateBoardPopoverContent"]',
      '[data-testid="CreateBoardCard"]',
    );

    const input = boardsPage.page.getByTestId('CreateBoardTitleInput');
    await input.press('Enter');

    await expect(input).toBeVisible();
    await expect(boardsPage.page.getByTestId('BoardCardTitle')).toHaveCount(0);
  });
});
