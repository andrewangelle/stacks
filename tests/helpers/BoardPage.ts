import { expect } from '@playwright/test';
import { BasePage } from '~test/helpers/BasePage';

export class BoardPage extends BasePage {
  async openSwitchBoards() {
    await this.waitForInteractiveTrigger(
      '[data-testid="SwitchBoardsContent"]',
      '[data-testid="SwitchBoardsTrigger"]',
    );

    await expect(this.page.getByTestId('SwitchBoardsContent')).toBeVisible();
  }

  async expectListCardCount(count: number) {
    const list = this.page.getByTestId('ListContainer');
    await expect(list.getByTestId('ListCardContainer')).toHaveCount(count);
    await this.expectListHeaderCardCount(count);
  }

  async expectListHeaderCardCount(count: number) {
    const list = this.page.getByTestId('ListContainer');
    await expect(list.getByTestId('ListHeaderCardCount')).toHaveText(
      `${count} `,
    );
  }

  listByTitle(listTitle: string) {
    return this.page.getByTestId('ListContainer').filter({
      has: this.page.getByTestId('ListName').filter({ hasText: listTitle }),
    });
  }
}
