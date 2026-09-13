import { expect, type Locator } from '@playwright/test';
import { CardPage } from '~test/helpers/CardPage';
import { resetDb } from '~test/helpers/resetDb';
import { seedActivities, seedBoard, seedCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

export class CardPageActivity extends CardPage {
  async seedCard() {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');
    const { card } = await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    return { card, board };
  }

  async setupActivity() {
    await resetDb(this.request);
    const { board, card } = await this.seedCard();

    await this.page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(async () => {
      await expect(this.page.getByTestId('CardModalContent')).toBeVisible();
      await expect(this.page.getByTestId('CardActivityColumn')).toBeVisible();
    }).toPass();

    return { board, card };
  }

  async setupSeededActivity() {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');
    const { list, card } = await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });
    await seedActivities(this.request, {
      boardId: board.id,
      listId: list.id,
      cardId: card.id,
      count: 2,
      type: 'feed',
    });

    await this.page.goto(`/board/${board.id}/card/${card.id}`);
  }

  async setupDeepLinks() {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');
    const { list, card } = await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    const activities = await seedActivities(this.request, {
      boardId: board.id,
      listId: list.id,
      cardId: card.id,
      count: 35,
    });

    // The feed loads ten entries at a time, so the target sits on the third
    // page — the list has to keep paging past the first fetch to reveal it.
    const target = activities[29];

    await this.page.goto(
      `/board/${board.id}/card/${card.id}#activity-${target.id}`,
    );

    return { target };
  }

  async addComment(text: string) {
    const activityColumn = this.page.getByTestId('CardActivityColumn');
    const input = activityColumn.getByTestId('AddCommentInput');
    const saveButton = activityColumn.locator(
      '[data-testid="SaveCommentButton"]:not([disabled])',
    );
    const commentContent = activityColumn
      .getByTestId('ActivityCommentContent')
      .filter({ hasText: text });

    await waitForInteractiveTrigger(
      this.page,
      '[data-testid="AddCommentInput"]',
      '[data-testid="AddCommentTrigger"]',
    );

    await expect(input).toBeVisible();

    await waitForHydratedAction(
      async () => {
        // Clearing before typing is what makes this retryable. A fill that lands
        // before React hydrates leaves the text in the DOM only: hydration then
        // initializes React's value tracker to that same text, so re-filling it
        // dispatches no change event, `comment` stays empty and Save never enables.
        // Writing '' first guarantees the next fill is a real change.
        await input.fill('');
        await input.fill(text);
        // Bounded so an un-hydrated form fails this attempt instead of waiting out
        // the whole test on a Save button that will never enable.
        await saveButton.click({ timeout: 5_000 });
      },
      async () => (await commentContent.count()) > 0,
    );

    await expect(commentContent).toBeVisible();

    // Scoped by shape, not by text: the edit test rewrites the content, and a
    // locator filtered on `text` would stop matching the moment it does.
    return activityColumn
      .getByTestId('ActivityContainer')
      .filter({ has: this.page.getByTestId('ActivityCommentContainer') })
      .first();
  }

  activityEntry(text: string) {
    return this.page
      .getByTestId('CardActivityColumn')
      .getByTestId('ActivityContainer')
      .filter({ hasText: text });
  }

  async hideDetails() {
    const toggleButton = this.page
      .getByTestId('CardActivityColumn')
      .getByTestId('HideActivityButton');

    return waitForHydratedAction(
      () => toggleButton.click(),
      async () => (await toggleButton.textContent()) === 'Show details',
    );
  }

  async installClipboardSpy() {
    await this.page.addInitScript(() => {
      window.__copiedText = '';

      const record = (text: string) => {
        window.__copiedText = text;
      };

      try {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: (text: string) => {
              record(text);
              return Promise.resolve();
            },
            readText: () => Promise.resolve(window.__copiedText),
          },
        });
      } catch {
        // Clipboard not configurable in this browser; tests fall back to the URL.
      }
    });
  }

  readCopiedText() {
    return this.page.evaluate(() => window.__copiedText);
  }

  async waitForSaveButton(commentContainer: Locator) {
    await expect(async () => {
      const editInput = commentContainer.getByTestId('AddCommentInput');

      if ((await editInput.count()) === 0) {
        return;
      }

      const saveButton = commentContainer.locator(
        '[data-testid="SaveCommentButton"]:not([disabled])',
      );

      if ((await saveButton.count()) > 0) {
        await saveButton.click();
      }

      await expect(editInput).toHaveCount(0);
    }).toPass();
  }
}
