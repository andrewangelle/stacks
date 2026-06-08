import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForPopover } from '~test/helpers/waitForPopover';

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
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await waitForPopover(
      page,
      'EditCardTitleInput',
      '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
    );

    await page.getByTestId('EditCardTitleInput').fill('Write E2E docs');

    await page.waitForFunction(() => {
      const title = document.querySelector(
        '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
      );
      if (title?.textContent?.trim() === 'Write E2E docs') return true;
      document
        .querySelector('[data-testid="DescriptionPlaceholder"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return (
        document
          .querySelector(
            '[data-testid="CardModalTitleContainer"] [data-testid="CardModalTitle"]',
          )
          ?.textContent?.trim() === 'Write E2E docs'
      );
    });

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
    await expect(page.getByTestId('CardModalContent')).toBeVisible();

    await expect(
      page.getByTestId('CardModalTitleContainer').getByTestId('CardModalTitle'),
    ).toHaveText('Write docs');

    await waitForPopover(
      page,
      'DescriptionInput',
      '[data-testid="DescriptionPlaceholder"]',
    );

    await page
      .getByTestId('DescriptionInput')
      .pressSequentially('Add acceptance criteria.');

    await waitForPopover(
      page,
      'CardDescriptionText',
      '[data-testid="SaveDescriptionButton"]',
    );

    await expect(page.getByTestId('CardDescriptionText')).toHaveText(
      'Add acceptance criteria.',
    );
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
    await expect(page.getByTestId('CardModalContent')).toBeVisible();

    await page.waitForFunction(() => {
      if (
        document.querySelector('[data-testid="DeleteChecklistPopoverContent"]')
      ) {
        return true;
      }
      document
        .querySelector(
          '[data-testid="CardActionsContainer"] [data-testid="DeleteCardPopoverTrigger"]',
        )
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return !!document.querySelector(
        '[data-testid="DeleteChecklistPopoverContent"]',
      );
    });

    await page
      .getByTestId('CardActionsContainer')
      .getByTestId('DeleteChecklistPopoverButton')
      .click();

    await page.goto(`/board/${board.id}`);
    await expect(page.getByTestId('ListCardContainer')).toHaveCount(0);
  });
});
