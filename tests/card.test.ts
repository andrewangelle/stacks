import { expect, type Page, test } from '@playwright/test';
import { expectCardCompletionActivity } from '~test/helpers/expectCardCompletionActivity';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Card', () => {
  test('edits the card name', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);
    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="EditCardTitleInput"]',
      '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
    );

    await page.getByTestId('EditCardTitleInput').fill('Write E2E docs');

    await waitForCardTitleToBeUpdated(page);

    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write E2E docs');
  });

  test('adds a description on a card', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Write docs',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );

    await page
      .getByTestId('DescriptionInput')
      .pressSequentially('Add acceptance criteria.');

    await waitForInteractiveTrigger(
      page,
      '[data-testid="CardDescriptionText"]',
      '[data-testid="SaveDescriptionButton"]',
    );

    await expect(page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria.',
    );
  });

  test('marks a card complete in the card modal', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    const completionCircle = page
      .getByTestId('CardModalTitleContainer')
      .getByTestId('CardTitleModalTriggerCircle');

    await expect(completionCircle).not.toHaveAttribute('data-completed', '');

    await waitForCardCompleted(page);

    await expectCompletedCheckmark(completionCircle);
    await expectCardCompletionActivity(page, 'marked this card complete');
  });

  test('marks a card incomplete in the card modal', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    const completionCircle = page
      .getByTestId('CardModalTitleContainer')
      .getByTestId('CardTitleModalTriggerCircle');

    await waitForCardCompleted(page);
    await expectCompletedCheckmark(completionCircle);

    await waitForCardIncomplete(page);
    await expectIncompleteCheckmark(completionCircle);
    await expectCardCompletionActivity(page, 'marked this card incomplete');
  });

  test('deletes a card', async ({ page, request }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await waitForCardModal(page);

    await waitForInteractiveTrigger(
      page,
      '[data-testid="DeleteChecklistPopoverContent"]',
      '[data-testid="CardActionsContainer"] [data-testid="DeleteCardPopoverTrigger"]',
    );

    await page
      .getByTestId('CardActionsContainer')
      .getByTestId('DeleteChecklistPopoverButton')
      .click();

    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('ListCardContainer')).toHaveCount(0);
  });
});

async function waitForCardCompleted(page: Page) {
  const completionCircle = modalCompletionCircle(page);

  return waitForHydratedAction(
    () => completionCircle.click(),
    async () => (await completionCircle.getAttribute('data-completed')) === '',
  );
}

async function waitForCardIncomplete(page: Page) {
  const completionCircle = modalCompletionCircle(page);

  return waitForHydratedAction(
    () => completionCircle.click(),
    async () => (await completionCircle.getAttribute('data-completed')) !== '',
  );
}

function modalCompletionCircle(page: Page) {
  return page
    .getByTestId('CardModalTitleContainer')
    .getByTestId('CardTitleModalTriggerCircle');
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

async function waitForCardTitleToBeUpdated(page: Page) {
  const cardTitle = page
    .getByTestId('CardModalTitleContainer')
    .getByTestId('CardModalTitle')
    .first();

  const trigger = () => page.getByTestId('DescriptionPlaceholder').click();
  const isDone = async () =>
    (await cardTitle.count()) > 0 &&
    (await cardTitle.textContent())?.trim() === 'Write E2E docs';

  return waitForHydratedAction(trigger, isDone);
}

async function waitForCardModal(page: Page) {
  await expect(async () => {
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
  }).toPass();
}
