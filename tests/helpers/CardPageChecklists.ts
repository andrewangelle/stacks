import { expect, type Locator } from '@playwright/test';
import { CardPage } from '~test/helpers/CardPage';

export class CardPageChecklists extends CardPage {
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
