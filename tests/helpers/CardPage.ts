import { type APIRequestContext, expect, type Page } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

const slideProgress = [0, 0.25, 0.5];

type Slide = {
  heights: number[];
  end: number;
};

export class CardPage {
  constructor(
    public readonly page: Page,
    public readonly request: APIRequestContext,
  ) {}

  async setup(cardTitle: string) {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');
    const { card } = await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle,
    });

    await this.page.goto(`/board/${board.id}/card/${card.id}`);
    await this.waitForCardModal();
    return {
      board,
      card,
    };
  }

  async setupWithDescription() {
    const seeded = await this.setup('Write docs');

    await waitForInteractiveTrigger(
      this.page,
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );
    await this.page
      .getByTestId('DescriptionInput')
      .pressSequentially('Add acceptance criteria.');

    await waitForInteractiveTrigger(
      this.page,
      '[data-testid="CardDescriptionText"]',
      '[data-testid="SaveDescriptionButton"]',
    );

    return seeded;
  }

  async waitForCardModal() {
    await expect(async () => {
      await expect(this.page.getByTestId('CardModalContent')).toBeVisible();
    }).toPass();
  }

  async waitForCardTitleToBeUpdated() {
    const cardTitle = this.page
      .getByTestId('CardModalTitleContainer')
      .getByTestId('CardModalTitle')
      .first();

    const trigger = () =>
      this.page.getByTestId('DescriptionPlaceholder').click();
    const isDone = async () =>
      (await cardTitle.count()) > 0 &&
      (await cardTitle.textContent())?.trim() === 'Write E2E docs';

    return waitForHydratedAction(trigger, isDone);
  }

  async selectBlockType(label: string) {
    await this.page.getByTestId('RichTextBlockSelect').click();
    await this.page
      .getByTestId('RichTextBlockSelectMenu')
      .getByRole('option', { name: label })
      .click();
  }

  async waitForCardCompleted() {
    const completionCircle = this.modalCompletionCircle();

    return waitForHydratedAction(
      () => completionCircle.click(),
      async () =>
        (await completionCircle.getAttribute('data-completed')) === '',
    );
  }

  modalCompletionCircle() {
    return this.page
      .getByTestId('CardModalTitleContainer')
      .getByTestId('CardTitleModalTriggerCircle');
  }

  async expectCompletedCheckmark() {
    await expect(this.modalCompletionCircle()).toHaveAttribute(
      'data-completed',
      '',
    );
    await expect(
      this.modalCompletionCircle().getByTestId(
        'CardCompletedIndicatorCheckmark',
      ),
    ).toBeVisible();
  }

  async expectCardCompletionActivity(
    content: 'marked this card complete' | 'marked this card incomplete',
  ) {
    const activityColumn = this.page.getByTestId('CardActivityColumn');
    const toggleButton = activityColumn.getByTestId('HideActivityButton');

    if (await toggleButton.getByText('Show details').isVisible()) {
      await toggleButton.click();
    }

    await expect(async () => {
      await expect(
        activityColumn
          .getByTestId('ActivityCommentContainer')
          .filter({ hasText: content }),
      ).toBeVisible();
    }).toPass();
  }

  async waitForCardIncomplete() {
    const completionCircle = this.modalCompletionCircle();

    return waitForHydratedAction(
      () => completionCircle.click(),
      async () =>
        (await completionCircle.getAttribute('data-completed')) !== '',
    );
  }

  async expectIncompleteCheckmark() {
    await expect(this.modalCompletionCircle()).not.toHaveAttribute(
      'data-completed',
      '',
    );
    await expect(
      this.modalCompletionCircle().getByTestId(
        'CardCompletedIndicatorCheckmark',
      ),
    ).toHaveCount(0);
  }

  async descriptionTitlePlacement() {
    const title = await this.page.getByTestId('DescriptionTitle').boundingBox();
    const row = await this.page
      .getByTestId('DescriptionHeadingRow')
      .boundingBox();

    if (!title || !row) {
      throw new Error('Description heading is not on screen');
    }

    return {
      offsetX: title.x - row.x,
      offsetY: title.y - row.y,
      width: title.width,
      height: title.height,
      rowWidth: row.width,
      rowHeight: row.height,
    };
  }

  async descriptionBodyHeight() {
    const box = await this.page
      .getByTestId('DescriptionBodyInner')
      .boundingBox();
    return box?.height ?? 0;
  }

  async selectedText() {
    return this.page.evaluate(() => window.getSelection()?.toString() ?? '');
  }

  async gotoSettled(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async seedBoardsScenario() {
    await resetDb(this.request);
    const source = await seedBoard(this.request, 'Sprint Board');
    const { card } = await seedCard(this.request, {
      boardId: source.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });
    const target = await seedBoard(this.request, 'Backlog');
    await seedCard(this.request, {
      boardId: target.id,
      listTitle: 'Later',
      cardTitle: 'Existing card',
    });
    return { source, target, card };
  }

  async seedListsScenario() {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');
    const { card } = await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });
    await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'Doing',
      cardTitle: 'Plan sprint',
    });
    return { board, card };
  }

  async openMoveMenu(boardId: string, cardId: string) {
    await this.page.goto(`/board/${boardId}/card/${cardId}`);
    await this.waitForCardModal();
    await waitForInteractiveTrigger(
      this.page,
      '[data-testid="MoveCardMenuContent"]',
      '[data-testid="MoveCardMenuTrigger"]',
    );
    await expect(this.page.getByTestId('MoveCardMenuContent')).toBeVisible();
  }

  async openSelect(triggerTestId: string) {
    const trigger = this.page.getByTestId(triggerTestId);
    await expect(async () => {
      if ((await trigger.getAttribute('aria-expanded')) !== 'true') {
        await trigger.focus();
        await trigger.press('Space');
      }
      await expect(trigger).toHaveAttribute('aria-expanded', 'true', {
        timeout: 1000,
      });
    }).toPass();
  }

  async selectMoveBoard(boardTitle: string) {
    await this.openSelect('Board-ComboboxToggleButton');
    await this.page.getByTestId(`ComboboxItem-${boardTitle}`).click();
    await expect(this.page.getByTestId('MoveCardButton')).toBeEnabled();
  }

  async selectMoveList(listTitle: string) {
    await this.openSelect('List-ComboboxToggleButton');
    await this.page.getByTestId(`ComboboxItem-${listTitle}`).click();
    await expect(this.page.getByTestId('MoveCardButton')).toBeEnabled();
  }

  async selectMovePosition(position: string) {
    await this.openSelect('Position-ComboboxToggleButton');
    await this.page.getByTestId(`ComboboxItem-${position}`).click();
  }

  async submitMove() {
    const moveButton = this.page.getByTestId('MoveCardButton');
    await expect(moveButton).toBeEnabled();
    const moved = this.page.waitForResponse(
      (response) =>
        response.url().includes('/_serverFn') &&
        response.request().method() === 'POST',
    );
    await moveButton.click();
    await moved;
  }

  async expectListOrder(listTitle: string, cardTitles: string[]) {
    const list = this.page
      .getByTestId('ListContainer')
      .filter({ hasText: listTitle });
    await expect(async () => {
      const cards = list.getByTestId('ListCardContainer');
      await expect(cards).toHaveCount(cardTitles.length);
      for (let index = 0; index < cardTitles.length; index++) {
        await expect(cards.nth(index)).toContainText(cardTitles[index]);
      }
    }).toPass();
  }

  async expectTransferEntries(links: { from: string; to: string }) {
    const activity = this.page.getByTestId('CardActivityColumn');
    await expect(
      activity
        .getByTestId('ActivityCommentContainer')
        .filter({ hasText: `transferred this card from ${links.from}` }),
    ).toBeVisible();
    await expect(
      activity
        .getByTestId('ActivityCommentContainer')
        .filter({ hasText: `transferred this card to ${links.to}` }),
    ).toBeVisible();
  }

  async expectLinkNavigatesToBoard(linkText: string, boardId: string) {
    await this.page
      .getByTestId('CardActivityColumn')
      .getByTestId('ActivityCommentContainer')
      .filter({ hasText: `transferred this card from ${linkText}` })
      .getByText(linkText)
      .click();
    await expect(this.page).toHaveURL(
      new RegExp(`/board/${boardId.slice(0, 8)}`),
    );
  }

  async driveSlide(act: () => Promise<void>): Promise<Slide> {
    const sliding = this.page.evaluate((progress) => {
      const body = document.querySelector('[data-testid="DescriptionBody"]');
      const inner = document.querySelector(
        '[data-testid="DescriptionBodyInner"]',
      );

      if (!body || !inner) {
        throw new Error('Description body is not mounted');
      }

      const readHeight = () => inner.getBoundingClientRect().height;

      // Polled rather than driven off `transitionrun`, so the measurement leans
      // on one API instead of two. Catching the slide late costs nothing: it is
      // paused and rewound before anything is read.
      const findSlide = () =>
        body
          .getAnimations()
          .find(
            (candidate) =>
              (candidate as Animation & { transitionProperty?: string })
                .transitionProperty === 'grid-template-rows',
          );

      return new Promise<Slide>((resolve, reject) => {
        const start = performance.now();

        function pollForSlide() {
          const animation = findSlide();

          if (!animation) {
            if (performance.now() - start > 5_000) {
              reject(
                new Error('grid-template-rows never started transitioning'),
              );
            } else {
              setTimeout(pollForSlide);
            }
            return;
          }

          animation.pause();

          const duration = Number(
            animation.effect?.getComputedTiming().duration,
          );

          if (!Number.isFinite(duration) || duration <= 0) {
            reject(new Error(`Slide has no duration: ${duration}`));
            return;
          }

          const heights = progress.map((fraction) => {
            animation.currentTime = duration * fraction;
            return readHeight();
          });

          animation.finish();

          resolve({ heights, end: readHeight() });
        }

        pollForSlide();
      });
    }, slideProgress);

    await act();

    return sliding;
  }

  /**
   * The body leaves `from`, is somewhere strictly between the two resting heights
   * at every point sampled after that, and is still moving the same way each
   * time. A snap would sit on `to` from the first sample on.
   */
  expectSlide(slide: Slide, { from, to }: { from: number; to: number }) {
    expect(slide.heights[0]).toBeCloseTo(from, 0);

    const [low, high] = from < to ? [from, to] : [to, from];

    for (const height of slide.heights.slice(1)) {
      expect(height).toBeGreaterThan(low);
      expect(height).toBeLessThan(high);
    }

    for (const [index, height] of slide.heights.slice(1).entries()) {
      expect(Math.sign(height - slide.heights[index])).toBe(
        Math.sign(to - from),
      );
    }

    expect(slide.end).toBeCloseTo(to, 0);
  }
}
