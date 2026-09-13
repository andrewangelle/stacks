import { expect, type Locator } from '@playwright/test';
import { CardPage } from '~test/helpers/CardPage';

type ClipboardWindow = { __richTextCopied: { text: string } };

export class CardPageRichText extends CardPage {
  async openDescriptionEditor(): Promise<Locator> {
    await this.setup('Write docs');

    await this.waitForInteractiveTrigger(
      '[data-testid="DescriptionInput"]',
      '[data-testid="DescriptionPlaceholder"]',
    );

    return this.page.getByTestId('DescriptionInput');
  }

  async saveDescription() {
    await this.page.getByTestId('SaveDescriptionButton').click();
    await expect(this.page.getByTestId('CardDescriptionText')).toBeVisible();
  }

  async installClipboardSpy() {
    await this.page.addInitScript(() => {
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

  readCopiedText() {
    return this.page.evaluate(
      () => (window as unknown as ClipboardWindow).__richTextCopied.text,
    );
  }
}
