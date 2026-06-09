import type { Page } from '@playwright/test';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';

/**
 * SSR paints controls before React attaches handlers. Retry clicking the
 * trigger until content identified by `contentSelector` exists.
 */
export function waitForInteractiveTrigger(
  page: Page,
  contentSelector: string,
  triggerSelector: string,
) {
  return waitForHydratedAction(
    () => page.locator(triggerSelector).first().click(),
    async () => (await page.locator(contentSelector).count()) > 0,
  );
}
