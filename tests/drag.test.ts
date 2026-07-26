import { expect, type Locator, type Page, test } from '@playwright/test';
import {
  expectListCardCount,
  listByTitle,
} from '~test/helpers/expectListHeaderCardCount';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard, seedListCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';

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

    const movePersisted = page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );

    // The board's lists stream in via RSC + Suspense, so @dnd-kit sortables
    // hydrate after the SSR markup paints. Retry the drag until it registers.
    await waitForHydratedAction(
      () => dragToLocator(page, card, targetCard),
      async () =>
        (await listByTitle(page, 'To Do')
          .getByTestId('ListCardContainer')
          .count()) === 0,
    );

    await expect(async () => {
      await expectCardInList(page, 'To Do', []);
      await expectCardInList(page, 'Done', ['Move me', 'Stay here']);
    }).toPass();

    await movePersisted;
    await page.reload();
    await expect(page.getByTestId('ListContainer')).toHaveCount(2);
    await expectCardInList(page, 'To Do', []);
    await expectCardInList(page, 'Done', ['Move me', 'Stay here']);
  });

  test('reorders lists on the board', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'First card',
    });
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'Done',
      cardTitle: 'Second card',
    });

    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('ListContainer')).toHaveCount(2);
    await expect(page.getByTestId('ListName')).toHaveText(['To Do', 'Done']);

    const reorderPersisted = page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );

    // The board's lists stream in via RSC + Suspense, so @dnd-kit sortables
    // hydrate after the SSR markup paints. Retry the drag until it registers.
    await waitForHydratedAction(
      () =>
        dragToLocator(
          page,
          listByTitle(page, 'To Do'),
          listByTitle(page, 'Done'),
        ),
      async () => {
        const names = await page.getByTestId('ListName').allTextContents();
        return names[0]?.trim() === 'Done';
      },
    );

    // Regression guard: reordering a list must not freeze the UI. If the drop
    // handler threw (e.g. a hook called outside render), the optimistic reorder
    // below never lands and the board stops responding.
    await expect(async () => {
      await expect(page.getByTestId('ListName')).toHaveText(['Done', 'To Do']);
    }).toPass();

    await reorderPersisted;
    await page.reload();
    await expect(page.getByTestId('ListContainer')).toHaveCount(2);
    await expect(page.getByTestId('ListName')).toHaveText(['Done', 'To Do']);
  });

  test('reorders lists reached through the masked board url', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'First card',
    });
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'Done',
      cardTitle: 'Second card',
    });

    // Navigating from the boards page masks the url to the board id's first 8
    // chars. The reorder must send the full id the server matches on, or it
    // rejects the request and the optimistic reorder rolls straight back.
    await page.goto('/boards');
    await waitForHydratedAction(
      () => page.getByTestId('BoardCardContainer').click(),
      async () => page.url().includes('/board/'),
    );
    await expect(page).toHaveURL(`/board/${board.id.slice(0, 8)}`);

    await expect(page.getByTestId('ListContainer')).toHaveCount(2);
    await expect(page.getByTestId('ListName')).toHaveText(['To Do', 'Done']);

    const reorderPersisted = page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );

    await waitForHydratedAction(
      () =>
        dragToLocator(
          page,
          listByTitle(page, 'To Do'),
          listByTitle(page, 'Done'),
        ),
      async () => {
        const names = await page.getByTestId('ListName').allTextContents();
        return names[0]?.trim() === 'Done';
      },
    );

    await reorderPersisted;

    // The rollback is what a masked-id reorder looks like from the outside, so
    // hold the new order past the server round-trip before reloading.
    await expect(page.getByTestId('ListName')).toHaveText(['Done', 'To Do']);
    await page.waitForTimeout(500);
    await expect(page.getByTestId('ListName')).toHaveText(['Done', 'To Do']);

    await page.reload();
    await expect(page.getByTestId('ListContainer')).toHaveCount(2);
    await expect(page.getByTestId('ListName')).toHaveText(['Done', 'To Do']);
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

    const movePersisted = page.waitForResponse(
      (res) =>
        res.url().includes('_serverFn') &&
        res.request().method() === 'POST' &&
        res.status() === 200,
    );
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

    await movePersisted;
    await page.reload();
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
    await expect(prepChecklist.getByTestId('CheckboxLabel')).toHaveCount(0);
    await expect(qaChecklist.getByTestId('CheckboxLabel')).toHaveCount(2);
  });
});

async function expectCardInList(
  page: Page,
  listTitle: string,
  cardTitles: string[],
) {
  const list = listByTitle(page, listTitle);
  await expectListCardCount(list, cardTitles.length);

  for (const title of cardTitles) {
    await expect(
      list.getByTestId('ListCardContainer').filter({ hasText: title }),
    ).toBeVisible();
  }
}

const autoScrollBand = 0.2;
const viewportInset = 8;
const targetReachTimeout = 10_000;

async function dragToLocator(page: Page, source: Locator, target: Locator) {
  await centerDragPair(page, source, target);

  const from = await dragPoint(source);

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  // WebKit coalesces fast synthetic pointer moves, so dnd-kit can miss the
  // drag activation or settle on a stale drop target. Give the pointer sensor
  // a beat to register the press, cross the activation threshold, then land a
  // second move on the target so the current drop target is up to date before
  // release.
  await page.waitForTimeout(100);
  await page.mouse.move(from.x, from.y + 12, { steps: 5 });
  await page.waitForTimeout(100);
  await movePointerOntoTarget(page, target);
  await page.waitForTimeout(100);
  await page.mouse.up();
}

async function dragPoint(locator: Locator) {
  const box = await locator.boundingBox();

  if (!box) {
    throw new Error('Could not resolve drag source or target bounding box');
  }

  return {
    x: box.x + box.width / 2,
    y: box.y + Math.min(box.height / 2, 20),
  };
}

// Mobile viewports are narrower than two lists side by side, so the drop
// target starts off-screen and a missed attempt leaves the board auto-scrolled
// with the source off-screen too. The drag points still fit when the lists
// don't.
async function centerDragPair(page: Page, source: Locator, target: Locator) {
  const viewport = page.viewportSize();

  if (!viewport) return;

  for (let attempt = 0; attempt < 3; attempt++) {
    const from = await dragPoint(source);
    const to = await dragPoint(target);
    const left = Math.min(from.x, to.x);
    const right = Math.max(from.x, to.x);

    if (left >= viewportInset && right <= viewport.width - viewportInset) {
      return;
    }

    await scrollBoardBy(source, (left + right) / 2 - viewport.width / 2);
  }
}

async function scrollBoardBy(locator: Locator, distance: number) {
  await locator.evaluate((element, by) => {
    for (let node = element.parentElement; node; node = node.parentElement) {
      if (
        /(auto|scroll)/.test(getComputedStyle(node).overflowX) &&
        node.scrollWidth > node.clientWidth
      ) {
        node.scrollLeft += by;
        return;
      }
    }

    window.scrollBy(by, 0);
  }, distance);
}

async function movePointerOntoTarget(page: Page, target: Locator) {
  const viewport = page.viewportSize();
  const deadline = Date.now() + targetReachTimeout;

  while (true) {
    const to = await dragPoint(target);

    if (!viewport || (to.x >= 0 && to.x <= viewport.width)) {
      await page.mouse.move(to.x, to.y, { steps: 30 });
      await page.mouse.move(to.x, to.y, { steps: 5 });
      return;
    }

    if (Date.now() > deadline) {
      throw new Error('Drag target never scrolled within reach of the pointer');
    }

    // Park in dnd-kit's auto-scroll band and let the board bring the target in.
    const bandX =
      to.x > viewport.width
        ? viewport.width * (1 - autoScrollBand / 2)
        : viewport.width * (autoScrollBand / 2);

    await page.mouse.move(bandX, Math.min(to.y, viewport.height - 1), {
      steps: 5,
    });
    await page.waitForTimeout(100);
  }
}
