import { expect } from '@playwright/test';

/**
 * SSR paints controls before React attaches handlers, so an early click can be
 * lost. Retry on the Node side until `isDone()` is true: each attempt checks
 * first (so we never re-fire on an already-applied action, avoiding toggles),
 * then runs `trigger` and re-checks.
 *
 * Unlike an in-page `waitForFunction`, `trigger` and `isDone` run in Node, so
 * they can use Playwright locators and capture test variables directly.
 */
export async function waitForHydratedAction(
  trigger: () => Promise<void>,
  isDone: () => Promise<boolean>,
) {
  await expect(async () => {
    if (await isDone()) return;
    await trigger();
    expect(await isDone()).toBe(true);
  }).toPass();
}
