import { expect, type Page, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedListCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('List', () => {
  test('truncates checklists and items on a list card', async ({
    page,
    request,
  }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [
        {
          title: 'Prep',
          items: ['Step 1', 'Step 2', 'Step 3', 'Step 4', 'Step 5'],
        },
        { title: 'QA', items: ['Run tests'] },
        { title: 'Docs', items: ['Update readme'] },
        { title: 'Deploy', items: ['Ship to prod'] },
      ],
    });

    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('ListContainer')).toBeVisible();
    await expect(page.getByTestId('ListCardContainer')).toContainText(
      'Launch feature',
    );

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardTitleDetailsChecklistDivider"]',
      '[data-testid="CardTitleDetailsChecklistTotalsContainer"]',
    );

    await expect(
      page.getByTestId('CardTitleDetailsChecklistAccordionItem'),
    ).toHaveCount(3);

    await expect(
      page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: '...and 1 more' }),
    ).toBeVisible();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardTitleDetailsChecklistItemRow"]',
      '[data-testid="CardTitleDetailsChecklistAccordionTrigger"]',
    );

    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(3);

    await expect(
      page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: 'Show more' }),
    ).toBeVisible();

    await waitForItemToBeVisible(page);

    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(5);

    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemLabel').filter({
        hasText: 'Step 5',
      }),
    ).toBeVisible();
  });

  test('edits the list name', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('ListContainer')).toBeVisible();
    await expect(page.getByTestId('ListName')).toHaveText('In Progress');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="AddCardInput"]',
      '[data-testid="EditableListName"] [data-testid="ListName"]',
    );

    await page
      .getByTestId('EditableListName')
      .getByTestId('AddCardInput')
      .fill('Done');

    await waitForUpdatedListName(page);

    await page.reload();
    await expect(page.getByTestId('ListName')).toHaveText('Done');
  });

  test('deletes a list', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('ListContainer')).toBeVisible();

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DeleteChecklistPopoverContent"]',
      '[data-testid="ListContainer"] [data-testid="DeleteListIcon"]',
    );

    await page
      .getByTestId('DeleteChecklistPopoverButton')
      .filter({ hasText: 'Delete list' })
      .click();

    await expect(page.getByTestId('ListContainer')).toHaveCount(0);
  });
});

/**
 * Local utils
 */
async function waitForUpdatedListName(page: Page) {
  const trigger = () => page.getByTestId('BoardTitle').click();
  const isUpdated = async () =>
    (await page
      .getByTestId('EditableListName')
      .getByTestId('AddCardInput')
      .count()) === 0;

  return waitForHydratedAction(trigger, isUpdated);
}

async function waitForItemToBeVisible(page: Page) {
  const trigger = () =>
    page
      .getByTestId('CardTitleDetailsChecklistShowMore')
      .filter({ hasText: 'Show more' })
      .first()
      .click();

  const isVisible = async () =>
    (await page.getByTestId('CardTitleDetailsChecklistItemRow').count()) >= 5;

  return waitForHydratedAction(trigger, isVisible);
}
