import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard, seedListCard } from '~test/helpers/seed';
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

  test('marks a checklist item complete in the card modal', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedListCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists: [{ title: 'Launch checklist', items: ['Deploy to staging'] }],
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(page.getByTestId('CardModalContent')).toBeVisible();
    await expect(page.getByTestId('ChecklistContainer')).toBeVisible();

    const checkbox = page.getByTestId('CheckboxRoot');
    await expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    await page.waitForFunction(() => {
      const root = document.querySelector('[data-testid="CheckboxRoot"]');
      if (root?.getAttribute('data-state') === 'checked') return true;
      root?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return (
        document
          .querySelector('[data-testid="CheckboxRoot"]')
          ?.getAttribute('data-state') === 'checked'
      );
    });

    await expect(checkbox).toHaveAttribute('data-state', 'checked');
    await expect(page.getByTestId('ChecklistProgressPercentage')).toHaveText(
      '100%',
    );
    await expect(page.getByTestId('CheckboxLabel')).toHaveCSS(
      'text-decoration',
      /line-through/,
    );
  });

  test('edits a checklist item label in the card modal', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedListCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists: [{ title: 'Launch checklist', items: ['Deploy to staging'] }],
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(page.getByTestId('ChecklistContainer')).toBeVisible();

    await waitForPopover(
      page,
      'EditChecklistItemContainer',
      '[data-testid="CheckboxLabel"]',
    );

    const editForm = page.getByTestId('EditChecklistItemContainer');
    await editForm
      .getByTestId('AddChecklistItemInput')
      .fill('Deploy to production');

    await page.waitForFunction(() => {
      const label = document.querySelector('[data-testid="CheckboxLabel"]');
      if (label?.textContent?.trim() === 'Deploy to production') return true;
      document
        .querySelector(
          '[data-testid="EditChecklistItemContainer"] [data-testid="AddChecklistButton"]',
        )
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return (
        document
          .querySelector('[data-testid="CheckboxLabel"]')
          ?.textContent?.trim() === 'Deploy to production'
      );
    });

    await expect(page.getByTestId('CheckboxLabel')).toHaveText(
      'Deploy to production',
    );
  });

  test('deletes a checklist item in the card modal', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedListCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists: [
        {
          title: 'Launch checklist',
          items: ['Deploy to staging', 'Notify team'],
        },
      ],
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(page.getByTestId('ChecklistContainer')).toBeVisible();
    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(2);

    await page.getByTestId('ChecklistCheckboxContainer').first().hover();

    await page.waitForFunction(() => {
      if (
        document.querySelector('[data-testid="DeleteChecklistPopoverContent"]')
      ) {
        return true;
      }
      document
        .querySelector('[data-testid="DeleteChecklistPopoverTrigger"] svg')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return !!document.querySelector(
        '[data-testid="DeleteChecklistPopoverContent"]',
      );
    });

    await page.getByTestId('DeleteChecklistPopoverButton').click();

    await expect(page.getByTestId('CheckboxLabel')).toHaveCount(1);
    await expect(page.getByTestId('CheckboxLabel')).toHaveText('Notify team');
  });

  test('edits the checklist title in the card modal', async ({
    page,
    request,
  }) => {
    await resetDb(request);
    const board = await seedBoard(request, 'Sprint Board');
    const { card } = await seedListCard(request, {
      boardId: board.id,
      listTitle: 'To Do',
      cardTitle: 'Ship feature',
      checklists: [{ title: 'Launch checklist', items: ['Deploy to staging'] }],
    });

    await page.goto(`/board/${board.id}/card/${card.id}`);
    await expect(page.getByTestId('ChecklistContainer')).toBeVisible();

    await waitForPopover(
      page,
      'EditCardTitleInput',
      '[data-testid="ChecklistTitle"]',
    );

    await page
      .getByTestId('ChecklistContainer')
      .getByTestId('EditCardTitleInput')
      .fill('Release checklist');

    await page.waitForFunction(() => {
      const title = document.querySelector('[data-testid="ChecklistTitle"]');
      if (title?.textContent?.trim() === 'Release checklist') return true;
      document
        .querySelector('[data-testid="DescriptionTitle"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return (
        document
          .querySelector('[data-testid="ChecklistTitle"]')
          ?.textContent?.trim() === 'Release checklist'
      );
    });

    await expect(page.getByTestId('ChecklistTitle')).toHaveText(
      'Release checklist',
    );
  });
});
