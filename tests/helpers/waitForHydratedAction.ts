import type { Page } from '@playwright/test';

/**
 * SSR paints controls before React attaches handlers. Poll until `isDone()` is
 * true, clicking `trigger` on each attempt when it is not.
 *
 * `trigger` is a CSS selector passed to `document.querySelector`, or a
 * zero-arg function (serialized into the page) for dynamic targets.
 *
 * `isDone` is serialized into the page; use only literals inside it, not
 * variables from the test runner closure.
 */
export function waitForHydratedAction(
  page: Page,
  trigger: string | (() => void),
  isDone: () => boolean,
) {
  const triggerSelector = typeof trigger === 'string' ? trigger : null;
  const triggerSource = typeof trigger === 'string' ? null : trigger.toString();

  return page.waitForFunction(
    ({ triggerSelector, triggerSource, isDoneSource }) => {
      function revive<Result>(source: string) {
        return new Function(`return (${source})`)() as () => Result;
      }

      function clickTrigger() {
        if (triggerSelector) {
          document
            .querySelector(triggerSelector)
            ?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
          return;
        }

        if (triggerSource) {
          revive<void>(triggerSource)();
        }
      }

      const done = revive<boolean>(isDoneSource);
      if (done()) return true;

      clickTrigger();
      return done();
    },
    {
      triggerSelector,
      triggerSource,
      isDoneSource: isDone.toString(),
    },
  );
}
