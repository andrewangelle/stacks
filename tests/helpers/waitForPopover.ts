import type { Page } from '@playwright/test';

/**
 * SSR paints controls before React attaches handlers. Poll until clicking the
 * trigger opens content identified by `contentTestId`.
 *
 * `triggerSelector` is passed to `document.querySelector` (e.g. a data-testid
 * or `[data-testid="AddListContainer"] button`).
 */
export function waitForPopover(
  page: Page,
  contentTestId: string,
  triggerSelector: string,
) {
  return page.waitForFunction(
    ({ content, trigger }) => {
      if (document.querySelector(`[data-testid="${content}"]`)) {
        return true;
      }
      document
        .querySelector(trigger)
        ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      return !!document.querySelector(`[data-testid="${content}"]`);
    },
    { content: contentTestId, trigger: triggerSelector },
  );
}
