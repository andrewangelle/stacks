import { expect, type Locator, type Page, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard, seedListCard } from '~test/helpers/seed';

test.describe('Drag and drop', () => {
  test.describe.configure({ timeout: 60_000 });

  test('moves a card to another list on the board', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Move me',
    });
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'Done',
      cardTitle: 'Stay here',
    });

    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('ListContainer')).toHaveCount(2);

    const card = page
      .getByTestId('DraggableCard')
      .filter({ hasText: 'Move me' });
    const targetCard = page
      .getByTestId('DraggableCard')
      .filter({ hasText: 'Stay here' });

    await dragToLocator(page, card, targetCard);

    await expect(async () => {
      await expectCardInList(page, 'To Do', []);
      await expectCardInList(page, 'Done', ['Move me', 'Stay here']);
    }).toPass();

    await page.reload();
    await expect(page.getByTestId('ListContainer')).toHaveCount(2);
    await expectCardInList(page, 'To Do', []);
    await expectCardInList(page, 'Done', ['Move me', 'Stay here']);
  });

  test('moves a checklist item to another checklist on the same card', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedListCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists: [
        { title: 'Prep', items: ['Item to move'] },
        { title: 'QA', items: ['Existing item'] },
      ],
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(page.getByTestId('CardModalContent')).toBeVisible();

    const itemToMove = page
      .getByTestId('DraggableChecklistItem')
      .filter({ hasText: 'Item to move' });
    const targetItem = page
      .getByTestId('DraggableChecklistItem')
      .filter({ hasText: 'Existing item' });

    await dragToLocator(page, itemToMove, targetItem);

    const prepChecklist = page.getByTestId('ChecklistContainer').filter({
      has: page.getByTestId('ChecklistTitle').filter({ hasText: 'Prep' }),
    });
    const qaChecklist = page.getByTestId('ChecklistContainer').filter({
      has: page.getByTestId('ChecklistTitle').filter({ hasText: 'QA' }),
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

    // await page.reload();
    // await expect(page.getByTestId('CardModalContent')).toBeVisible();
    // await expect(prepChecklist.getByTestId('CheckboxLabel')).toHaveCount(0);
    // await expect(qaChecklist.getByTestId('CheckboxLabel')).toHaveCount(2);
  });
});

function listByTitle(page: Page, listTitle: string) {
  return page.getByTestId('ListContainer').filter({
    has: page.getByTestId('ListName').filter({ hasText: listTitle }),
  });
}

async function expectCardInList(
  page: Page,
  listTitle: string,
  cardTitles: string[],
) {
  const list = listByTitle(page, listTitle);
  await expect(list.getByTestId('ListCardContainer')).toHaveCount(
    cardTitles.length,
  );

  for (const title of cardTitles) {
    await expect(
      list.getByTestId('ListCardContainer').filter({ hasText: title }),
    ).toBeVisible();
  }
}

async function dragToLocator(page: Page, source: Locator, target: Locator) {
  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error('Could not resolve drag source or target bounding box');
  }

  const fromX = sourceBox.x + sourceBox.width / 2;
  const fromY = sourceBox.y + Math.min(sourceBox.height / 2, 20);
  const toX = targetBox.x + targetBox.width / 2;
  const toY = targetBox.y + Math.min(targetBox.height / 2, 20);

  await page.mouse.move(fromX, fromY);
  await page.mouse.down();
  await page.mouse.move(fromX, fromY + 12, { steps: 5 });
  await page.mouse.move(toX, toY, { steps: 30 });
  await page.mouse.up();
}
