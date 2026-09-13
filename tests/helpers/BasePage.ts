import { type APIRequestContext, expect, type Page } from '@playwright/test';

declare global {
  var __copiedText: string;
}

export class BasePage {
  constructor(
    public readonly page: Page,
    public readonly request: APIRequestContext,
  ) {}

  async waitForHydratedAction(
    trigger: () => Promise<void>,
    isDone: () => Promise<boolean>,
  ) {
    await expect(async () => {
      if (await isDone()) return;
      await trigger();
      await expect.poll(isDone).toBe(true);
    }).toPass();
  }

  waitForInteractiveTrigger(contentSelector: string, triggerSelector: string) {
    return this.waitForHydratedAction(
      () => this.page.locator(triggerSelector).first().click(),
      async () => (await this.page.locator(contentSelector).count()) > 0,
    );
  }

  waitForServerFnResponse() {
    return this.page.waitForResponse(
      (response) =>
        response.url().includes('/_serverFn') &&
        response.request().method() === 'POST',
    );
  }

  async installClipboardSpy() {
    await this.page.addInitScript(() => {
      window.__copiedText = '';

      const record = (text: string) => {
        window.__copiedText = text;
      };

      try {
        Object.defineProperty(navigator, 'clipboard', {
          configurable: true,
          value: {
            writeText: (text: string) => {
              record(text);
              return Promise.resolve();
            },
            readText: () => Promise.resolve(window.__copiedText),
          },
        });
      } catch {
        // Clipboard not configurable in this browser; tests fall back to the URL.
      }
    });
  }

  readCopiedText() {
    return this.page.evaluate(() => window.__copiedText);
  }
}
