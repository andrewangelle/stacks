import { expect } from '@playwright/test';

/**
 * SSR paints controls before React attaches handlers, so an early click can be
 * lost. Retry on the Node side until `isDone()` is true: each attempt checks
 * first (so we never re-fire on an already-applied action, avoiding toggles),
 * then runs `trigger` and waits for the result to land.
 *
 * Polling after `trigger` is what makes the retry safe. An action that was
 * received but needs a navigation or a server round-trip to become visible
 * reads as not-done the instant it fires, and re-firing it either toggles the
 * applied action back off or blocks forever behind UI the first attempt opened.
 * Only re-fire once the action has had the configured expect timeout to settle.
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
    await expect.poll(isDone).toBe(true);
  }).toPass();
}
