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

- A per-request `ServerStyleSheet` is passed to `StyleSheetManager sheet=`. This
  is also why `createGlobalStyle` (`GlobalFonts`) works — the default main sheet
  has `server === false` on the server and silently drops global styles.
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
