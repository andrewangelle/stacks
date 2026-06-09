import type { Page } from '@playwright/test';
import { waitForHydratedAction } from '~test/helpers/waitForHydratedAction';

/**
 * SSR paints controls before React attaches handlers. Poll until clicking the
 * trigger opens content identified by `contentSelector`.
 */
export function waitForInteractiveTrigger(
  page: Page,
  contentSelector: string,
  triggerSelector: string,
) {
  const isDone = new Function(
    `return () => !!document.querySelector(${JSON.stringify(contentSelector)})`,
  )() as () => boolean;

  return waitForHydratedAction(page, triggerSelector, isDone);
}
