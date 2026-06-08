import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForPopover } from '~test/helpers/waitForPopover';

test.describe('Card', () => {
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
});
