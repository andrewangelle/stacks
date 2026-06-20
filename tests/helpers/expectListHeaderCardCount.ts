import { expect, type Locator, type Page } from '@playwright/test';

export function listByTitle(page: Page, listTitle: string) {
  return page.getByTestId('ListContainer').filter({
    has: page.getByTestId('ListName').filter({ hasText: listTitle }),
  });
}

export async function expectListHeaderCardCount(list: Locator, count: number) {
  await expect(list.getByTestId('ListHeaderCardCount')).toHaveText(`${count} `);
}

export async function expectListCardCount(list: Locator, count: number) {
  await expect(list.getByTestId('ListCardContainer')).toHaveCount(count);
  await expectListHeaderCardCount(list, count);
}
