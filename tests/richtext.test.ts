import type { APIRequestContext, Locator, Page } from '@playwright/test';
import { expect, test } from '~test/fixtures';
import { resetDb } from '~test/helpers/resetDb';
import { seedBoard, seedCard } from '~test/helpers/seed';
import { waitForInteractiveTrigger } from '~test/helpers/waitForInteractiveTrigger';

test.describe('Rich text markdown', () => {
  test('formats inline markdown as it is typed', async ({ page, request }) => {
    const editor = await openDescriptionEditor(page, request);

    await editor.pressSequentially('**Bold** *Italic* ~~Gone~~ `Code`');
    await saveDescription(page);

    const description = page.getByTestId('CardDescriptionText');

    await expect(description.locator('strong')).toHaveText('Bold');
    await expect(description.locator('em')).toHaveText('Italic');
    await expect(description.locator('s')).toHaveText('Gone');
    await expect(description.locator('.rich-text-inline-code')).toHaveText(
      'Code',
    );

    // The markers must be consumed, not left in the text alongside the format.
    await expect(description).not.toContainText('**');
    await expect(description).not.toContainText('~~');
  });

  test('formats block markdown as it is typed', async ({ page, request }) => {
    const editor = await openDescriptionEditor(page, request);

    await editor.pressSequentially('###### Deep heading');
    await editor.press('Enter');

    await editor.pressSequentially('1. First');
    await editor.press('Enter');
    // A second Enter on the empty item leaves the list the way it was entered.
    await editor.press('Enter');

    await editor.pressSequentially('> Quoted');
    await editor.press('Enter');

    await editor.pressSequentially('--- ');
    await editor.pressSequentially('``` const answer = 42');

    // Decorator nodes are marked contenteditable="false", so a rule meant for
    // the editable root can silently inflate the divider to the editor's own
    // minimum height.
    const dividerHeight = await editor
      .locator('hr')
      .evaluate((divider) => divider.getBoundingClientRect().height);
    expect(dividerHeight).toBeLessThan(4);

    await saveDescription(page);

    const description = page.getByTestId('CardDescriptionText');

    await expect(description.locator('h6')).toHaveText('Deep heading');
    await expect(description.locator('ol li')).toHaveText('First');
    await expect(description.locator('blockquote')).toHaveText('Quoted');
    await expect(description.locator('hr')).toHaveCount(1);
    await expect(description.locator('.rich-text-code')).toHaveText(
      'const answer = 42',
    );
  });

  test('turns link and image markdown into elements', async ({
    page,
    request,
  }) => {
    const editor = await openDescriptionEditor(page, request);

    await editor.pressSequentially('[Link](http://a.com)');
    await editor.press('Enter');
    await editor.pressSequentially('![Alt text](http://www.image.com)');

    await saveDescription(page);

    const description = page.getByTestId('CardDescriptionText');
    const link = description.locator('a');

    await expect(link).toHaveText('Link');
    await expect(link).toHaveAttribute('href', 'http://a.com');
    await expect(description.locator('img')).toHaveAttribute('alt', 'Alt text');

    // Formatting has to survive the round trip through the database, not just
    // the editor session that applied it.
    await page.reload();
    await expect(description.locator('a')).toHaveText('Link');
    await expect(description.locator('img')).toHaveAttribute('alt', 'Alt text');
  });

  test('reveals the markdown source and copies it', async ({
    page,
    request,
  }) => {
    await installClipboardSpy(page);

    const editor = await openDescriptionEditor(page, request);

    await editor.pressSequentially('## Release notes');

    await page.getByRole('button', { name: 'Show markdown' }).click();

    const source = page.getByTestId('RichTextMarkdownSource');

    await expect(source).toHaveText('## Release notes');
    await expect(page.getByTestId('DescriptionInput')).toBeHidden();

    const copyButton = page.getByRole('button', { name: 'Copy markdown' });

    await copyButton.click();
    await expect(copyButton).toHaveText('Copied');
    expect(await readCopiedText(page)).toBe('## Release notes');

    await page.getByRole('button', { name: 'Close markdown' }).click();

    await expect(source).toHaveCount(0);
    await expect(page.getByTestId('DescriptionInput')).toBeVisible();
  });

  test('opens the editor help dialog', async ({ page, request }) => {
    await openDescriptionEditor(page, request);

    await page.getByRole('button', { name: 'Editor help' }).click();

    const help = page.getByTestId('RichTextHelpContent');

    await expect(help).toBeVisible();
    await expect(help.getByTestId('RichTextHelpTitle')).toHaveText(
      'Editor help',
    );
    await expect(help.getByTestId('RichTextHelpKey')).toContainText([
      '**Bold**',
      '*Italic*',
      '~~Strikethrough~~',
    ]);

    await page.getByRole('button', { name: 'Close editor help' }).click();

    await expect(help).toHaveCount(0);
  });
});

async function openDescriptionEditor(
  page: Page,
  request: APIRequestContext,
): Promise<Locator> {
  await resetDb(request);

  const board = await seedBoard(request, 'Sprint Board');
  const { card } = await seedCard(request, {
    boardId: board.id,
    listTitle: 'To Do',
    cardTitle: 'Write docs',
  });

  await page.goto(`/board/${board.id}/card/${card.id}`);
  await expect(page.getByTestId('CardModalContent')).toBeVisible();

  await waitForInteractiveTrigger(
    page,
    '[data-testid="DescriptionInput"]',
    '[data-testid="DescriptionPlaceholder"]',
  );

  return page.getByTestId('DescriptionInput');
}

async function saveDescription(page: Page) {
  await page.getByTestId('SaveDescriptionButton').click();
  await expect(page.getByTestId('CardDescriptionText')).toBeVisible();
}

type ClipboardWindow = { __richTextCopied: { text: string } };

/**
 * Records what the app writes to the clipboard so the copy button can be
 * asserted without depending on per-browser clipboard permissions.
 */
async function installClipboardSpy(page: Page) {
  await page.addInitScript(() => {
    const store = { text: '' };

    try {
      Object.defineProperty(window, '__richTextCopied', {
        configurable: true,
        value: store,
      });
      Object.defineProperty(navigator, 'clipboard', {
        configurable: true,
        value: {
          writeText: (text: string) => {
            store.text = text;
            return Promise.resolve();
          },
          readText: () => Promise.resolve(store.text),
        },
      });
    } catch {
      // Clipboard not configurable in this browser; the assertion falls back
      // to the button's own state.
    }
  });
}

function readCopiedText(page: Page) {
  return page.evaluate(
    () => (window as unknown as ClipboardWindow).__richTextCopied.text,
  );
}
