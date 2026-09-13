import { expect, test } from '~test/fixtures';
import { CardPage } from '~test/helpers/CardPage';

test.describe('Rich text markdown', () => {
  let cardPage: CardPage;

  test.beforeEach(async ({ page, request }) => {
    cardPage = new CardPage(page, request);
  });

  test('formats inline markdown as it is typed', async () => {
    const editor = await cardPage.openDescriptionEditor();

    await editor.pressSequentially('**Bold** *Italic* ~~Gone~~ `Code`');
    await cardPage.saveDescription();

    const description = cardPage.page.getByTestId('CardDescriptionText');

    await expect(description.locator('strong')).toHaveText('Bold');
    await expect(description.locator('em')).toHaveText('Italic');
    await expect(description.locator('s')).toHaveText('Gone');
    await expect(description.locator('.rich-text-inline-code')).toHaveText(
      'Code',
    );

    await expect(description).not.toContainText('**');
    await expect(description).not.toContainText('~~');
  });

  test('formats block markdown as it is typed', async () => {
    const editor = await cardPage.openDescriptionEditor();

    await editor.pressSequentially('###### Deep heading');
    await editor.press('Enter');

    await editor.pressSequentially('1. First');
    await editor.press('Enter');
    await editor.press('Enter');

    await editor.pressSequentially('> Quoted');
    await editor.press('Enter');

    await editor.pressSequentially('--- ');
    await editor.pressSequentially('``` const answer = 42');

    const dividerHeight = await editor
      .locator('hr')
      .evaluate((divider) => divider.getBoundingClientRect().height);
    expect(dividerHeight).toBeLessThan(4);

    await cardPage.saveDescription();

    const description = cardPage.page.getByTestId('CardDescriptionText');

    await expect(description.locator('h6')).toHaveText('Deep heading');
    await expect(description.locator('ol li')).toHaveText('First');
    await expect(description.locator('blockquote')).toHaveText('Quoted');
    await expect(description.locator('hr')).toHaveCount(1);
    await expect(description.locator('.rich-text-code')).toHaveText(
      'const answer = 42',
    );
  });

  test('nests a list item with tab instead of leaving the editor', async () => {
    const editor = await cardPage.openDescriptionEditor();

    await editor.pressSequentially('* Parent');
    await editor.press('Enter');
    await editor.press('Tab');
    await editor.pressSequentially('Child');

    await expect(editor).toBeFocused();
    await expect(editor.locator('ul ul li')).toHaveText('Child');

    await cardPage.saveDescription();

    const description = cardPage.page.getByTestId('CardDescriptionText');

    await expect(
      description.locator('li.rich-text-nested-listitem ul li'),
    ).toHaveText('Child');
  });

  test('turns link and image markdown into elements', async () => {
    const editor = await cardPage.openDescriptionEditor();

    await editor.pressSequentially('[Link](http://a.com)');
    await editor.press('Enter');
    await editor.pressSequentially('![Alt text](http://www.image.com)');

    await cardPage.saveDescription();

    const description = cardPage.page.getByTestId('CardDescriptionText');
    const link = description.locator('a');

    await expect(link).toHaveText('Link');
    await expect(link).toHaveAttribute('href', 'http://a.com');
    await expect(description.locator('img')).toHaveAttribute('alt', 'Alt text');

    await cardPage.page.reload();
    await expect(description.locator('a')).toHaveText('Link');
    await expect(description.locator('img')).toHaveAttribute('alt', 'Alt text');
  });

  test('reveals the markdown source and copies it', async () => {
    await cardPage.installClipboardSpy();

    const editor = await cardPage.openDescriptionEditor();

    await editor.pressSequentially('## Release notes');

    await cardPage.page.getByRole('button', { name: 'Show markdown' }).click();

    const source = cardPage.page.getByTestId('RichTextMarkdownSource');

    await expect(source).toHaveText('## Release notes');
    await expect(cardPage.page.getByTestId('DescriptionInput')).toBeHidden();

    const copyButton = cardPage.page.getByRole('button', {
      name: 'Copy markdown',
    });

    await copyButton.click();
    await expect(copyButton).toHaveText('Copied');
    expect(await cardPage.readCopiedText()).toBe('## Release notes');

    await cardPage.page.getByRole('button', { name: 'Close markdown' }).click();

    await expect(source).toHaveCount(0);
    await expect(cardPage.page.getByTestId('DescriptionInput')).toBeVisible();
  });

  test('opens the editor help dialog', async () => {
    await cardPage.openDescriptionEditor();

    await cardPage.page.getByRole('button', { name: 'Editor help' }).click();

    const help = cardPage.page.getByTestId('RichTextHelpContent');

    await expect(help).toBeVisible();
    await expect(help.getByTestId('RichTextHelpTitle')).toHaveText(
      'Editor help',
    );
    await expect(help.getByTestId('RichTextHelpKey')).toContainText([
      '**Bold**',
      '*Italic*',
      '~~Strikethrough~~',
    ]);

    await cardPage.page
      .getByRole('button', { name: 'Close editor help' })
      .click();

    await expect(help).toHaveCount(0);
  });
});
