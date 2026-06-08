import { expect, test } from '@playwright/test';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedListCard } from '~test/helpers/seed';
import { waitForPopover } from '~test/helpers/waitForPopover';

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

    await waitForPopover(
      page,
      'CardTitleDetailsChecklistDivider',
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

    await page.waitForFunction(() => {
      if (
        document.querySelector(
          '[data-testid="CardTitleDetailsChecklistItemRow"]',
        )
      ) {
        return true;
      }

      document
        .querySelector(
          '[data-testid="CardTitleDetailsChecklistAccordionTrigger"]',
        )
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      return !!document.querySelector(
        '[data-testid="CardTitleDetailsChecklistItemRow"]',
      );
    });

    await expect(
      page.getByTestId('CardTitleDetailsChecklistItemRow'),
    ).toHaveCount(3);

    await expect(
      page
        .getByTestId('CardTitleDetailsChecklistShowMore')
        .filter({ hasText: 'Show more' }),
    ).toBeVisible();

    await page.waitForFunction(() => {
      if (
        document.querySelectorAll(
          '[data-testid="CardTitleDetailsChecklistItemRow"]',
        ).length >= 5
      ) {
        return true;
      }

      const showMore = [
        ...document.querySelectorAll(
          '[data-testid="CardTitleDetailsChecklistShowMore"]',
        ),
      ].find((button) => button.textContent?.trim() === 'Show more');

      showMore?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      return (
        document.querySelectorAll(
          '[data-testid="CardTitleDetailsChecklistItemRow"]',
        ).length >= 5
      );
    });

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

    await waitForPopover(
      page,
      'AddCardInput',
      '[data-testid="EditableListName"] [data-testid="ListName"]',
    );

    await page
      .getByTestId('EditableListName')
      .getByTestId('AddCardInput')
      .fill('Done');

    await page.waitForFunction(() => {
      if (
        !document.querySelector(
          '[data-testid="EditableListName"] [data-testid="AddCardInput"]',
        )
      ) {
        return true;
      }
      document
        .querySelector('[data-testid="BoardTitle"]')
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return !document.querySelector(
        '[data-testid="EditableListName"] [data-testid="AddCardInput"]',
      );
    });

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

    await page.waitForFunction(() => {
      if (
        document.querySelector('[data-testid="DeleteChecklistPopoverContent"]')
      ) {
        return true;
      }
      document
        .querySelector(
          '[data-testid="ListContainer"] [data-testid="DeleteListIcon"]',
        )
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return !!document.querySelector(
        '[data-testid="DeleteChecklistPopoverContent"]',
      );
    });

    await page
      .getByTestId('DeleteChecklistPopoverButton')
      .filter({ hasText: 'Delete list' })
      .click();

    await expect(page.getByTestId('ListContainer')).toHaveCount(0);
  });
});
