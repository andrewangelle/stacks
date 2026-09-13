import { expect, type Locator } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedListCard } from '~test/helpers/seed';
import { BasePage } from './BasePage';

export type ChecklistSeed = {
  title: string;
  items: string[];
};

export class ChecklistPage extends BasePage {
  async openCardWithChecklists(checklists: ChecklistSeed[]) {
    await resetDb(this.request);
    const board = await seedBoard(this.request, 'Sprint Board');
    const { card } = await seedListCard(this.request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists,
    });

    await this.page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(this.page.getByTestId('CardModalContent')).toBeVisible();
    await expect(
      this.page.getByTestId('ChecklistContainer').first(),
    ).toBeVisible();

    await expect(this.page.getByTestId('ActivityListViewport')).toBeAttached();

    return { board, card };
  }

  firstChecklist() {
    return this.page.getByTestId('ChecklistContainer').first();
  }

  async tabTo(target: Locator) {
    await expect(async () => {
      for (let press = 0; press < 30; press += 1) {
        if (await target.evaluate((node) => node === document.activeElement)) {
          return;
        }
        await this.page.keyboard.press('Tab');
      }
      throw new Error('Control is not reachable from the keyboard');
    }).toPass();
  }

  waitForChecklistCollapsed(checklist: Locator, collapsed: boolean) {
    const trigger = () =>
      checklist.getByTestId('ChecklistToggleButton').click({ force: true });

    const isDone = async () =>
      (await checklist
        .getByTestId('ChecklistCollapsibleContent')
        .isHidden()) === collapsed;

    return this.waitForHydratedAction(trigger, isDone);
  }

  async checklistTitlePlacement(checklist: Locator) {
    const title = await checklist.getByTestId('ChecklistTitle').boundingBox();
    const header = await checklist.getByTestId('ChecklistHeader').boundingBox();

    if (!title || !header) {
      throw new Error('Checklist header is not on screen');
    }

    return {
      offsetX: title.x - header.x,
      offsetY: title.y - header.y,
      width: title.width,
      height: title.height,
      headerWidth: header.width,
      headerHeight: header.height,
    };
  }

  waitForChecked() {
    const trigger = () => this.page.getByTestId('CheckboxRoot').first().click();

    const isChecked = async () =>
      (await this.page
        .getByTestId('CheckboxRoot')
        .first()
        .getAttribute('data-state')) === 'checked';

    return this.waitForHydratedAction(trigger, isChecked);
  }

  waitForLabelToBeUpdated() {
    const label = this.page.getByTestId('CheckboxLabel').first();

    const trigger = () =>
      this.page
        .getByTestId('EditChecklistItemContainer')
        .getByTestId('AddChecklistButton')
        .click();

    const isUpdated = async () =>
      (await label.count()) > 0 &&
      (await label.textContent())?.trim() === 'Deploy to production';

    return this.waitForHydratedAction(trigger, isUpdated);
  }

  waitForTitleToBeUpdated() {
    const title = this.page.getByTestId('ChecklistTitle').first();

    const trigger = () => this.page.getByTestId('DescriptionTitle').click();

    const isUpdated = async () =>
      (await title.count()) > 0 &&
      (await title.textContent())?.trim() === 'Release checklist';

    return this.waitForHydratedAction(trigger, isUpdated);
  }

  waitForChecklistItemConverted() {
    const trigger = () =>
      this.page
        .getByTestId('PopoverOptionsContent')
        .getByTestId('ConvertChecklistItemToCardButton')
        .click();

    const isConverted = async () =>
      (await this.page.getByTestId('CheckboxLabel').count()) === 1 &&
      (
        await this.page.getByTestId('CheckboxLabel').first().textContent()
      )?.trim() === 'Notify team';

    return this.waitForHydratedAction(trigger, isConverted);
  }

  waitForToggleCheckedItems() {
    const toggleButton = this.page.getByTestId('ToggleCheckedItemsButton');

    const trigger = () => toggleButton.click();

    const isHidden = async () =>
      (await this.page.getByTestId('CheckboxLabel').count()) === 0 &&
      (await toggleButton.textContent())?.includes(
        'Show completed items (1)',
      ) === true;

    return this.waitForHydratedAction(trigger, isHidden);
  }

  async expectListCardCount(count: number) {
    const list = this.page.getByTestId('ListContainer');
    await expect(list.getByTestId('ListCardContainer')).toHaveCount(count);
    await expect(list.getByTestId('ListHeaderCardCount')).toHaveText(
      `${count} `,
    );
  }
}
