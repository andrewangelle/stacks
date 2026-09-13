import { expect, type Locator } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard, seedListCard } from '~test/helpers/seed';
import { BoardPageLists } from './BoardPageLists';

const autoScrollBand = 0.2;
const viewportInset = 8;
const targetReachTimeout = 10_000;

export class BoardPageDrag extends BoardPageLists {
  async setupDrag(cards: string[]) {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');

    await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: cards[0],
    });
    await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'Done',
      cardTitle: cards[1],
    });

    await this.page.goto(`/board/${board.id}`);
    await expect(this.page.getByTestId('ListContainer')).toHaveCount(2);

    return { board };
  }

  async setupChecklistDrag() {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');
    const { card } = await seedListCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists: [
        { title: 'Prep', items: ['Item to move'] },
        { title: 'QA', items: ['Existing item'] },
      ],
    });

    await this.page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(this.page.getByTestId('CardModalContent')).toBeVisible();
  }

  async expectCardInList(listTitle: string, cardTitles: string[]) {
    const list = this.listByTitle(listTitle);
    await expect(list.getByTestId('ListCardContainer')).toHaveCount(
      cardTitles.length,
    );

    for (const title of cardTitles) {
      await expect(
        list.getByTestId('ListCardContainer').filter({ hasText: title }),
      ).toBeVisible();
    }
  }

  async dragToLocator(source: Locator, target: Locator) {
    await this.centerDragPair(source, target);

    const from = await this.dragPoint(source);

    await this.page.mouse.move(from.x, from.y);
    await this.page.mouse.down();
    await this.page.waitForTimeout(100);
    await this.page.mouse.move(from.x, from.y + 12, { steps: 5 });
    await this.page.waitForTimeout(100);
    await this.movePointerOntoTarget(target);
    await this.page.waitForTimeout(100);
    await this.page.mouse.up();
  }

  async dragPoint(locator: Locator) {
    const box = await locator.boundingBox();

    if (!box) {
      throw new Error('Could not resolve drag source or target bounding box');
    }

    return {
      x: box.x + box.width / 2,
      y: box.y + Math.min(box.height / 2, 20),
    };
  }

  async centerDragPair(source: Locator, target: Locator) {
    const viewport = this.page.viewportSize();

    if (!viewport) return;

    for (let attempt = 0; attempt < 3; attempt++) {
      const from = await this.dragPoint(source);
      const to = await this.dragPoint(target);
      const left = Math.min(from.x, to.x);
      const right = Math.max(from.x, to.x);

      if (left >= viewportInset && right <= viewport.width - viewportInset) {
        return;
      }

      await this.scrollBoardBy(source, (left + right) / 2 - viewport.width / 2);
    }
  }

  async scrollBoardBy(locator: Locator, distance: number) {
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

  async movePointerOntoTarget(target: Locator) {
    const viewport = this.page.viewportSize();
    const deadline = Date.now() + targetReachTimeout;

    while (true) {
      const to = await this.dragPoint(target);

      if (!viewport || (to.x >= 0 && to.x <= viewport.width)) {
        await this.page.mouse.move(to.x, to.y, { steps: 30 });
        await this.page.mouse.move(to.x, to.y, { steps: 5 });
        return;
      }

      if (Date.now() > deadline) {
        throw new Error(
          'Drag target never scrolled within reach of the pointer',
        );
      }

      const bandX =
        to.x > viewport.width
          ? viewport.width * (1 - autoScrollBand / 2)
          : viewport.width * (autoScrollBand / 2);

      await this.page.mouse.move(bandX, Math.min(to.y, viewport.height - 1), {
        steps: 5,
      });
      await this.page.waitForTimeout(100);
    }
  }
}
