import { expect, test } from '@playwright/test';
import { BoardPageDrag } from '~test/helpers/BoardPageDrag';

test.describe('Drag and drop', () => {
  test.describe.configure({ timeout: 60_000 });

  let boardPage: BoardPageDrag;

  test.beforeEach(async ({ page, request }) => {
    boardPage = new BoardPageDrag(page, request);
  });

  test('moves a card to another list on the board', async () => {
    await boardPage.setupDrag(['Move me', 'Stay here']);

    const card = boardPage.page
      .getByTestId('DraggableCard')
      .filter({ hasText: 'Move me' });
    const targetCard = boardPage.page
      .getByTestId('DraggableCard')
      .filter({ hasText: 'Stay here' });

    const movePersisted = boardPage.page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );

    await boardPage.waitForHydratedAction(
      () => boardPage.dragToLocator(card, targetCard),
      async () =>
        (await boardPage
          .listByTitle('To Do')
          .getByTestId('ListCardContainer')
          .count()) === 0,
    );

    await expect(async () => {
      await boardPage.expectCardInList('To Do', []);
      await boardPage.expectCardInList('Done', ['Move me', 'Stay here']);
    }).toPass();

    await movePersisted;
    await boardPage.page.reload();
    await expect(boardPage.page.getByTestId('ListContainer')).toHaveCount(2);
    await boardPage.expectCardInList('To Do', []);
    await boardPage.expectCardInList('Done', ['Move me', 'Stay here']);
  });

  test('reorders lists on the board', async () => {
    await boardPage.setupDrag(['First card', 'Second card']);

    await expect(boardPage.page.getByTestId('ListName')).toHaveText([
      'To Do',
      'Done',
    ]);

    const reorderPersisted = boardPage.page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );

    await boardPage.waitForHydratedAction(
      () =>
        boardPage.dragToLocator(
          boardPage.listByTitle('To Do'),
          boardPage.listByTitle('Done'),
        ),
      async () => {
        const names = await boardPage.page
          .getByTestId('ListName')
          .allTextContents();
        return names[0]?.trim() === 'Done';
      },
    );

    await expect(async () => {
      await expect(boardPage.page.getByTestId('ListName')).toHaveText([
        'Done',
        'To Do',
      ]);
    }).toPass();

    await reorderPersisted;
    await boardPage.page.reload();
    await expect(boardPage.page.getByTestId('ListContainer')).toHaveCount(2);
    await expect(boardPage.page.getByTestId('ListName')).toHaveText([
      'Done',
      'To Do',
    ]);
  });

  test('reorders lists reached through the masked board url', async () => {
    const { board } = await boardPage.setupDrag(['First card', 'Second card']);

    await boardPage.page.goto('/boards');
    await boardPage.waitForHydratedAction(
      () => boardPage.page.getByTestId('BoardCardContainer').click(),
      async () => boardPage.page.url().includes('/board/'),
    );
    await expect(boardPage.page).toHaveURL(`/board/${board.id.slice(0, 8)}`);

    await expect(boardPage.page.getByTestId('ListContainer')).toHaveCount(2);
    await expect(boardPage.page.getByTestId('ListName')).toHaveText([
      'To Do',
      'Done',
    ]);

    const reorderPersisted = boardPage.page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );

    await boardPage.waitForHydratedAction(
      () =>
        boardPage.dragToLocator(
          boardPage.listByTitle('To Do'),
          boardPage.listByTitle('Done'),
        ),
      async () => {
        const names = await boardPage.page
          .getByTestId('ListName')
          .allTextContents();
        return names[0]?.trim() === 'Done';
      },
    );

    await reorderPersisted;

    await expect(boardPage.page.getByTestId('ListName')).toHaveText([
      'Done',
      'To Do',
    ]);
    await boardPage.page.waitForTimeout(500);
    await expect(boardPage.page.getByTestId('ListName')).toHaveText([
      'Done',
      'To Do',
    ]);

    await boardPage.page.reload();
    await expect(boardPage.page.getByTestId('ListContainer')).toHaveCount(2);
    await expect(boardPage.page.getByTestId('ListName')).toHaveText([
      'Done',
      'To Do',
    ]);
  });

  test('moves a checklist item to another checklist on the same card', async () => {
    await boardPage.setupChecklistDrag();

    const itemToMove = boardPage.page
      .getByTestId('DraggableChecklistItem')
      .filter({ hasText: 'Item to move' });
    const targetItem = boardPage.page
      .getByTestId('DraggableChecklistItem')
      .filter({ hasText: 'Existing item' });

    const movePersisted = boardPage.page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );
    await boardPage.dragToLocator(itemToMove, targetItem);

    const prepChecklist = boardPage.page
      .getByTestId('ChecklistContainer')
      .filter({
        has: boardPage.page
          .getByTestId('ChecklistTitle')
          .filter({ hasText: 'Prep' }),
      });
    const qaChecklist = boardPage.page
      .getByTestId('ChecklistContainer')
      .filter({
        has: boardPage.page
          .getByTestId('ChecklistTitle')
          .filter({ hasText: 'QA' }),
      });

    await expect(async () => {
      await expect(prepChecklist.getByTestId('CheckboxLabel')).toHaveCount(0);
      await expect(qaChecklist.getByTestId('CheckboxLabel')).toHaveCount(2);
      await expect(
        qaChecklist
          .getByTestId('CheckboxLabel')
          .filter({ hasText: 'Item to move' }),
      ).toBeVisible();
    }).toPass();

    await movePersisted;
    await boardPage.page.reload();
    await expect(boardPage.page.getByTestId('CardModalContent')).toBeVisible();
    await expect(prepChecklist.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(qaChecklist.getByTestId('CheckboxLabel')).toHaveCount(2);
  });
});
