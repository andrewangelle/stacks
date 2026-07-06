import { expect, type Locator, type Page, test } from '@playwright/test';
import { expectCardCompletionActivity } from '~test/helpers/expectCardCompletionActivity';
import { expectListCardCount } from '~test/helpers/expectListHeaderCardCount';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard, seedListCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('List', () => {
  // First navigation in a run can wait on Vite cold-compile; allow extra time.
  test.describe.configure({ timeout: 60_000 });

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
    await waitForListCard(page, 'Launch feature');

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
    await waitForList(page, 'In Progress');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="EditListNameInput"]',
      '[data-testid="EditableListName"] [data-testid="ListName"]',
    );

    await page
      .getByTestId('EditableListName')
      .getByTestId('EditListNameInput')
      .fill('Done');

    await waitForUpdatedListName(page);

    await waitForListAfterReload(page, 'Done');
  });

  test('marks a card complete on the list', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page);

    const listCard = page.getByTestId('ListCardContainer');
    const completionCircle = page.getByTestId('CardTitleModalTriggerCircle');

    await expect(completionCircle).not.toHaveAttribute('data-completed', '');

    await waitForCardCompletedOnList(page);

    await expectCompletedCheckmark(completionCircle);
    await expect(listCard).toContainText('Launch feature');

    await page.getByTestId('ListCardTitleDetailsContainer').click();
    await waitForCardModal(page);
    await expectCardCompletionActivity(page, 'marked this card complete');
  });

  test('marks a card incomplete on the list', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');

    await seedListCard(request, {
      boardId: board.id,
      listTitle: 'In Progress',
      cardTitle: 'Launch feature',
      checklists: [],
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page);

    const listCard = page.getByTestId('ListCardContainer');
    const completionCircle = page.getByTestId('CardTitleModalTriggerCircle');

    await waitForCardCompletedOnList(page);
    await expectCompletedCheckmark(completionCircle);

    await waitForCardIncompleteOnList(page);
    await expectIncompleteCheckmark(completionCircle);
    await expect(listCard).toContainText('Launch feature');

    await page.getByTestId('ListCardTitleDetailsContainer').click();
    await waitForCardModal(page);
    await expectCardCompletionActivity(page, 'marked this card incomplete');
  });

  test('inserts a card between existing cards', async ({ page, request }) => {
    await resetDb(request);

    const board = await seedBoard(request, 'Sprint Board');
    await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Alpha',
    });

    await page.goto(`/board/${board.id}`);
    await waitForListCard(page, 'Alpha');
    await expectListCardCount(page.getByTestId('ListContainer'), 1);

    await addCardAtEnd(page, 'Charlie');
    await expectListCardCount(page.getByTestId('ListContainer'), 2);

    const slot = page.getByTestId('AddNewCardAtPosition-0');
    await openAddCardAtPosition(slot);

    await slot.getByTestId('AddCardInput').fill('Bravo');
    await slot.getByTestId('AddCardButton').click();

    await expectListCardCount(page.getByTestId('ListContainer'), 3);

    const cards = page.getByTestId('ListCardContainer');
    await expect(cards.nth(0)).toContainText('Alpha');
    await expect(cards.nth(1)).toContainText('Bravo');
    await expect(cards.nth(2)).toContainText('Charlie');
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
    await waitForList(page);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="PopoverOptionsContent"]',
      '[data-testid="ListContainer"] [data-testid="DeleteListIcon"]',
    );

    await waitForHydratedAction(
      () =>
        page
          .getByTestId('DeleteChecklistPopoverButton')
          .filter({ hasText: 'Delete list' })
          .click(),
      async () => (await page.getByTestId('ListContainer').count()) === 0,
    );
  });
});

/**
 * Local utils
 */
async function addCardAtEnd(page: Page, cardTitle: string) {
  await waitForInteractiveTrigger(
    page,
    '[data-testid="AddCardInput"]',
    '[data-testid="AddCardText"]',
  );

  await page.getByTestId('AddCardInput').fill(cardTitle);
  await page.getByTestId('AddCardButton').click();

  await expect(
    page.getByTestId('ListCardContainer').filter({ hasText: cardTitle }),
  ).toBeVisible();
}

async function openAddCardAtPosition(slot: Locator) {
  await slot.hover();

  return waitForHydratedAction(
    () => slot.getByTestId('AddNewCardAtPositionPlus').click(),
    async () => (await slot.getByTestId('AddCardInput').count()) > 0,
  );
}

async function waitForCardCompletedOnList(page: Page) {
  return waitForCardCompletionOnList(page, true);
}

async function waitForCardIncompleteOnList(page: Page) {
  return waitForCardCompletionOnList(page, false);
}

async function waitForCardCompletionOnList(page: Page, completed: boolean) {
  const listCard = page.getByTestId('ListCardContainer');
  const completionCircle = page.getByTestId('CardTitleModalTriggerCircle');

  return waitForHydratedAction(
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

async function expectCompletedCheckmark(
  completionCircle: ReturnType<Page['getByTestId']>,
) {
  await expect(completionCircle).toHaveAttribute('data-completed', '');
  await expect(
    completionCircle.getByTestId('CardCompletedIndicatorCheckmark'),
  ).toBeVisible();
}

async function expectIncompleteCheckmark(
  completionCircle: ReturnType<Page['getByTestId']>,
) {
  await expect(completionCircle).not.toHaveAttribute('data-completed', '');
  await expect(
    completionCircle.getByTestId('CardCompletedIndicatorCheckmark'),
  ).toHaveCount(0);
}

async function waitForUpdatedListName(page: Page) {
  const trigger = () => page.getByTestId('BoardTitle').click();
  const isUpdated = async () =>
    (await page
      .getByTestId('EditableListName')
      .getByTestId('EditListNameInput')
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

async function waitForList(page: Page, listTitle?: string) {
  await expect(async () => {
    await expect(page.getByTestId('ListContainer')).toBeVisible();
    if (listTitle) {
      await expect(page.getByTestId('ListName')).toHaveText(listTitle);
    }
  }).toPass();
}

// A single reload can race the rename mutation's persistence to the
// backend — the client shows the new name optimistically before the write
// lands, so one reload can still serve the pre-rename value. Re-reload
// (not just re-check) until the persisted value shows up.
async function waitForListAfterReload(page: Page, listTitle: string) {
  await expect(async () => {
    await page.reload();
    await expect(page.getByTestId('ListName')).toHaveText(listTitle, {
      timeout: 5_000,
    });
  }).toPass();
}

async function waitForListCard(page: Page, cardTitle?: string) {
  await expect(async () => {
    await expect(page.getByTestId('ListContainer')).toBeVisible();
    const listCard = page.getByTestId('ListCardContainer');
    await expect(listCard).toBeVisible();
    if (cardTitle) {
      await expect(listCard).toContainText(cardTitle);
    }
  }).toPass();
}

async function waitForCardModal(page: Page) {
  await expect(async () => {
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
  }).toPass();
}
