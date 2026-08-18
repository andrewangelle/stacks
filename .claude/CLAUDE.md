# Agent notes

Project-specific gotchas that are expensive to rediscover. Keep entries short and
point at the code that enforces them.

## styled-components v7: SSR styles must be flushed manually

**Do not remove `ServerStyles` / the `sheet` prop in `src/routes/__root.tsx` or
`src/styles/ServerStyles.tsx`.** Without them the app server-renders `sc-*` class
names with zero `<style>` tags, and every page FOUCs until hydration injects CSS.

Why it is needed:

- v7 emits inline `<style>` tags on its own **only** in a true RSC environment.
  The gate is `IS_RSC`, i.e. `React.createContext === undefined`, which is true
  only under the `react-server` export condition.
- Our root is a client component (`ClerkProvider`, `DragDropProvider`), so it
  renders in TanStack Start's SSR environment where React *does* have
  `createContext`. styled-components falls back to its classic-SSR path:
  accumulate rules into a sheet, emit nothing.
- `rscPlugin` does **not** cause emission. It only rewrites `:nth-child` and `+`
  selectors so they ignore inline style tags. Its presence is not evidence that
  the RSC path is active.

How the fix works:

- A per-request `ServerStyleSheet` is passed to `StyleSheetManager sheet=`. The
  default main sheet has `server === false` on the server and silently drops
  anything registered there, `createGlobalStyle` included.
- `<ServerStyles>` renders as the **last** child of the manager so every styled
  component above it has already registered. It tags the `<style>` with React 19
  `href`/`precedence` so React hoists it into `<head>` while building the shell.

Known limitations, already accepted:

- React's hoistable-resource path only serializes `data-precedence`/`data-href`
  and strips `data-styled`/`data-styled-version`, so the client does not
  rehydrate from that tag — it re-inserts rules into CSSOM at hydration.
  Harmless (class names are content-hashed). Restoring the markers needs an
  inline script that races `<Scripts/>`'s `async` module; not worth it.
- `sheet.seal()` is deliberately not called. It would have to run outside
  render; calling it during render means a Suspense replay re-rendering
  `ServerStyles` hits `getStyleElement()`'s "can't collect styles once consumed"
  throw. The per-request sheet is garbage collected anyway.
- Styles for content inside a Suspense boundary that resolves after the shell
  flushes are not in the hoisted tag and still arrive at hydration.

To verify after touching any of this, check that the SSR HTML has a `<style>`
inside `<head>`:

```sh
curl -sL http://localhost:3000/ | grep -o '<style[^>]*>' | head
```

## Drag and drop: never change the placeholder's box

`src/styles/drag.css` styles @dnd-kit's `[data-dnd-placeholder]` clone as the
drop shadow. **Only paint it — do not give it a height, width, margin or
padding of its own.** @dnd-kit keeps a `ResizeObserver` on the placeholder and
re-projects the dragged element from its size:

```
top += (originalHeight - placeholderHeight) * grabPointWithinElement
```

A `height: fit-content` on the placeholder used to shrink a list wrapper from
the stretched board height (754px) down to content height (132px), which moved
the dragged list 12px away from the cursor the instant you grabbed it.

Lists are the awkward case: their wrapper is a stretched flex item, so painting
it leaves a full-height shadow. Paint the cloned `ListContainer` inside it
instead — it is already content-height and inset by the list's side margins.

To check a change, start a drag and compare the dragged element's `--dnd-top`
against the element's pre-drag `getBoundingClientRect().top`; they should differ
by 0.

## Global styles re-register the font face

Keep `@font-face` in `src/styles/fonts.css`, not in a `createGlobalStyle`.
styled-components re-inserts a global style's rules whenever the component
holding it re-renders, and re-registering an `@font-face` makes the browser
re-load the face — text falls back for a frame and the whole page reflows.
`GlobalFonts` used to sit inside `DragDropProvider`, so every drag start and
drag end reflowed the page.

## e2e: never assert on animation frames

CI's headless WebKit on Linux has a **median `requestAnimationFrame` gap of
~354ms** — about 3 frames per second (measured in the Playwright v1.60.0 image,
WebKit 26.4). A 150ms CSS transition usually falls entirely between two frames
there, so a test that samples height per frame finds no mid-animation frames and
fails on `webkit` and `Mobile Safari` in CI while passing on all five local
browsers.

Drive the transition instead of watching it: take it off the element with
`getAnimations()`, `pause()`, set `currentTime` to fractions of
`effect.getComputedTiming().duration`, and read layout at each point. No frame
budget is involved, and catching the transition late is harmless because it gets
rewound first. `driveSlide` / `expectSlide` in `tests/card.test.ts` do this for
the description collapse.

Local CPU load does **not** stand in for this: 16 busy loops (load average 44 on
8 cores) left the frame-sampling version passing on macOS WebKit. It is the Linux
headless build, not machine contention.

To check anything against the browser CI actually runs, use the matching image —
a `page.setContent` probe of just the CSS involved needs no dev server or DB:

```sh
docker run --rm -v "$PWD":/probe -w /probe -e PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1 \
  mcr.microsoft.com/playwright:v1.60.0-noble \
  bash -lc 'npm i --silent playwright@1.60.0 >/dev/null 2>&1 && node probe.mjs'
```
