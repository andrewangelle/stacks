import { expect, type Locator } from '@playwright/test';
import { BoardPage } from '~test/helpers/BoardPage';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';

export class BoardPageLists extends BoardPage {
  async seedEditCardBoard() {
    await resetDb(this.request);

    const board = await seedBoard(this.request, 'Edit Board');
    const { card } = await seedCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Edit me',
    });

    return { board, card };
  }

  async openEditCardPopover() {
    const card = this.page.getByTestId('ListCardContainer');
    await card.hover();

    await this.waitForHydratedAction(
      () => card.getByTestId('EditCardPopoverTrigger').click(),
      async () =>
        (await this.page.getByTestId('EditCardPopoverContent').count()) > 0,
    );
  }

  async openEditPopoverMoveSelect(triggerTestId: string) {
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

  async waitForRenamedCardAfterReload(newTitle: string) {
    await expect(async () => {
      await this.page.reload();
      await this.waitForListCard(newTitle);
    }).toPass();
  }

  async addCardAtEnd(cardTitle: string) {
    await this.waitForInteractiveTrigger(
      '[data-testid="AddCardInput"]',
      '[data-testid="AddCardText"]',
    );

    await this.page.getByTestId('AddCardInput').fill(cardTitle);
    await this.page.getByTestId('AddCardButton').click();

    await expect(
      this.page.getByTestId('ListCardContainer').filter({ hasText: cardTitle }),
    ).toBeVisible();
  }

  async openAddCardAtPosition(slot: Locator) {
    await slot.hover();

    return this.waitForHydratedAction(
      () => slot.getByTestId('AddNewCardAtPositionPlus').click(),
      async () => (await slot.getByTestId('AddCardInput').count()) > 0,
    );
  }

  async waitForCardCompletedOnList() {
    return this.waitForCardCompletionOnList(true);
  }

  async waitForCardIncompleteOnList() {
    return this.waitForCardCompletionOnList(false);
  }

  private async waitForCardCompletionOnList(completed: boolean) {
    const listCard = this.page.getByTestId('ListCardContainer');
    const completionCircle = this.page.getByTestId(
      'CardTitleModalTriggerCircle',
    );

    return this.waitForHydratedAction(
      async () => {
        await listCard.hover();
        await completionCircle.click();
      },
      async () => {
        const isCompleted =
          (await completionCircle.getAttribute('data-completed')) === '';
        return completed ? isCompleted : !isCompleted;
      },
    );
  }

  async expectCompletedCheckmark(completionCircle: Locator) {
    await expect(completionCircle).toHaveAttribute('data-completed', '');
    await expect(
      completionCircle.getByTestId('CardCompletedIndicatorCheckmark'),
    ).toBeVisible();
  }

  async expectIncompleteCheckmark(completionCircle: Locator) {
    await expect(completionCircle).not.toHaveAttribute('data-completed', '');
    await expect(
      completionCircle.getByTestId('CardCompletedIndicatorCheckmark'),
    ).toHaveCount(0);
  }

  async waitForUpdatedListName() {
    const trigger = () => this.page.getByTestId('BoardTitle').click();
    const isUpdated = async () =>
      (await this.page
        .getByTestId('EditableListName')
        .getByTestId('EditListNameInput')
        .count()) === 0;

    return this.waitForHydratedAction(trigger, isUpdated);
  }

  async waitForItemToBeVisible() {
    const trigger = () =>
      this.page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: 'Show more' })
        .first()
        .click();

    const isVisible = async () =>
      (await this.page
        .getByTestId('CardTitleDetailsChecklistItemRow')
        .count()) >= 5;

    return this.waitForHydratedAction(trigger, isVisible);
  }

  async waitForList(listTitle?: string) {
    await expect(async () => {
      await expect(this.page.getByTestId('ListContainer')).toBeVisible();
      if (listTitle) {
        await expect(this.page.getByTestId('ListName')).toHaveText(listTitle);
      }
    }).toPass();
  }

  async waitForListAfterReload(listTitle: string) {
    await expect(async () => {
      await this.page.reload();
      await expect(this.page.getByTestId('ListName')).toHaveText(listTitle, {
        timeout: 5_000,
      });
    }).toPass();
  }

  accordionItem(title: string) {
    return this.page
      .getByTestId('CardTitleDetailsChecklistAccordionItem')
      .filter({ hasText: title });
  }

  expectAccordionState(title: string, state: 'open' | 'closed') {
    return expect(this.accordionItem(title)).toHaveAttribute(
      'data-state',
      state,
    );
  }

  async waitForAccordionItemExpanded(title: string) {
    const item = this.accordionItem(title);
    const trigger = () =>
      item.getByTestId('CardTitleDetailsChecklistAccordionTrigger').click();
    const isOpen = async () =>
      (await item.getAttribute('data-state')) === 'open';

    return this.waitForHydratedAction(trigger, isOpen);
  }

  async waitForExpandedViewAfterReload() {
    await expect(async () => {
      await this.page.reload();
      await this.waitForListCard();
      await expect(
        this.page.getByTestId('CardTitleDetailsChecklistItemRow').first(),
      ).toBeVisible({ timeout: 5_000 });
    }).toPass();
  }

  async waitForExpandedAccordionAfterReload(
    openTitle: string,
    closedTitle: string,
  ) {
    await expect(async () => {
      await this.page.reload();
      await this.waitForListCard();
      await expect(this.accordionItem(openTitle)).toHaveAttribute(
        'data-state',
        'open',
        { timeout: 5_000 },
      );
      await expect(this.accordionItem(closedTitle)).toHaveAttribute(
        'data-state',
        'closed',
        { timeout: 5_000 },
      );
    }).toPass();
  }

  async waitForListCard(cardTitle?: string) {
    await expect(async () => {
      await expect(this.page.getByTestId('ListContainer')).toBeVisible();
      const listCard = this.page.getByTestId('ListCardContainer');
      await expect(listCard).toBeVisible();
      if (cardTitle) {
        await expect(listCard).toContainText(cardTitle);
      }
    }).toPass();
  }

  async waitForCardModal() {
    await expect(async () => {
      await expect(this.page.getByTestId('CardModalContent')).toBeVisible();
    }).toPass();
  }

  async gotoSettled(url: string) {
    await this.page.goto(url);
    await this.page.waitForLoadState('networkidle');
  }

  async openMoveListMenu(listTitle: string) {
    const list = this.page
      .getByTestId('ListContainer')
      .filter({ hasText: listTitle });
    const trigger = list.getByTestId('ListActionsPopoverButton');

    await this.waitForHydratedAction(
      () => trigger.click(),
      async () =>
        (await this.page.getByTestId('ListActionsOptionsContainer').count()) >
        0,
    );

    await this.page
      .getByTestId('ListActionsOption')
      .filter({ hasText: 'Move list' })
      .click();
    await expect(
      this.page.getByTestId('MoveListFieldsContainer'),
    ).toBeVisible();
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

  async selectMoveListBoard(boardTitle: string) {
    await this.openSelect('Board-ComboboxToggleButton');
    await this.page.getByTestId(`ComboboxItem-${boardTitle}`).click();
    await expect(this.page.getByTestId('MoveListButton')).toBeEnabled();
  }

  async selectMoveListPosition(position: string) {
    await this.openSelect('Position-ComboboxToggleButton');
    await this.page.getByTestId(`ComboboxItem-${position}`).click();
  }

  async submitListMove() {
    const moveButton = this.page.getByTestId('MoveListButton');
    await expect(moveButton).toBeEnabled();
    const moved = this.waitForServerFnResponse();
    await moveButton.click();
    await moved;
    await expect(this.page.getByTestId('MoveListFieldsContainer')).toBeHidden();
  }

  waitForServerFnResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes('/_serverFn') &&
        response.request().method() === 'POST',
    );
  }

  async expectBoardListOrder(titles: string[]) {
    await expect(async () => {
      const names = this.page.getByTestId('ListName');
      await expect(names).toHaveCount(titles.length);
      for (let index = 0; index < titles.length; index++) {
        await expect(names.nth(index)).toHaveText(titles[index]);
      }
    }).toPass();
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
}
