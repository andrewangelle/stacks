import { test as base, expect } from '@playwright/test';

/**
 * Playwright's mobile emulation "shrink-to-fits": when page content is wider
 * than the device — here the board's horizontally-scrolling lists — it zooms
 * the layout viewport out (e.g. ~614px on a 393px Pixel 5) so the overflow
 * fits. That balloons the fixed card modal past the screen and pushes its lower
 * content (activity column, checklist controls) out of pointer reach. A real
 * phone never does this: it keeps the layout viewport at device width and lets
 * the board scroll sideways, so the modal fits and scrolls internally.
 *
 * Clamping the document to the viewport width makes the emulator behave like a
 * real device. Applied only to the Mobile projects; desktop browsers are
 * untouched. Injected on every navigation so it survives page.goto.
 */
// biome-ignore lint/suspicious/noConfusingVoidType: <nothing else works>
export const test = base.extend<{ clampMobileViewport: void }>({
  clampMobileViewport: [
    async ({ page }, use, testInfo) => {
      if (testInfo.project.name.startsWith('Mobile')) {
        await page.addInitScript(() => {
          // Must never throw: this runs at document-start ahead of other init
          // scripts (e.g. a test's clipboard spy), and on WebKit an uncaught
          // error here aborts the injection and blocks those later scripts.
          try {
            // React (via TanStack head management) reconciles <head>/<html>
            // after hydration and strips any style we inject early, so re-assert
            // the clamp whenever the DOM changes to keep the viewport pinned.
            const CSS =
              'html,body{overflow-x:hidden!important;max-width:100vw!important;}';
            const ensure = () => {
              const parent = document.head ?? document.documentElement;
              if (!parent) return;
              let style = document.getElementById('__test-viewport-clamp');
              if (!style) {
                style = document.createElement('style');
                style.id = '__test-viewport-clamp';
                style.textContent = CSS;
              }
              if (style.parentNode !== parent) parent.appendChild(style);
            };
            ensure();
            document.addEventListener('DOMContentLoaded', ensure);
            window.addEventListener('load', ensure);
            const observe = () => {
              if (!document.documentElement) return;
              new MutationObserver(ensure).observe(document.documentElement, {
                childList: true,
                subtree: true,
              });
            };
            if (document.documentElement) observe();
            else document.addEventListener('DOMContentLoaded', observe);
          } catch {
            // Never let viewport bookkeeping break the page or other scripts.
          }
        });
      }
      await use();
    },
    { auto: true },
  ],
});

export { expect };
