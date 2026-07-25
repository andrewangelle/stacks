# Migration plan: @pigment-css/react → vanilla-extract

Status: executed. All styled files are converted, pigment is removed from the
dependency tree and vite config, and typecheck/lint/build pass. Kept for
reference; the pattern mappings below document the conventions now in use.

Two deviations from the original plan proved necessary during execution:
`@vanilla-extract/dynamic` was added for the one truly arbitrary style prop
(`circleSize` on the card completed-indicator), and child-targeting selectors
(`& > *`, `& > span`) had to become `globalStyle` calls — vanilla-extract
rejects them inside `style()`.

## Working rules for the executing agent

- Use **pnpm** for everything. Typecheck is `pnpm test:types`. E2E is `pnpm test`
  (requires `pnpm test:db:setup` once for the local test database).
- Leave changes **unstaged** in the working tree. Do not commit, stage, push, or
  open PRs.
- Do not add code comments narrating the migration. Write the converted code bare.
- Never declare a component inside another component; wrapper factories and
  wrapper components live at module scope.
- Do not bundle unrelated refactors into a migration step.

## Why this is not a find-and-replace

vanilla-extract (VE) has **no `styled` API and no template-literal syntax**.
Styles live in `*.css.ts` files evaluated at build time, exporting class-name
strings; components consume them via `className`. Pigment's `styled` produces
components. Something must bridge the ~250 styled-component call sites used
across ~50 consumer files.

**Chosen approach:** keep every consumer call site unchanged. Each
`X.styled.ts(x)` becomes a pair:

- `X.css.ts` — `style()` / `recipe()` / `keyframes()` definitions (object syntax)
- `X.styled.ts(x)` — same file path, **same export names and prop shapes**, but
  the exports become thin wrappers created by a shared factory that binds a
  class name (or recipe) to an element or component.

Both Vite plugins can coexist: pigment only transforms files importing
`@pigment-css`, VE only touches `.css.ts`. Migrate one directory at a time with
the e2e suite green between steps.

## Current inventory (verified 2026-07-25)

Files importing `@pigment-css/react` (17 styled files + globals + root + config):

| File | Notes |
|---|---|
| `src/styles/GlobalFonts.ts` | `globalCss` — font-face + html/body resets |
| `src/styles/Page.styled.tsx` | shared `Button`, `secondaryButtonStyles` object — **extended by other files** |
| `src/components/Boards/Boards.styled.ts` | pigment `variants:` arrays; re-exports `fontFamily` consumed by `Card.styled.ts` |
| `src/components/Boards/Board.styled.ts` | |
| `src/components/Nav/Nav.styled.ts` | `variants:` arrays keyed on `background` enum (blue/green/lightGreen/…) |
| `src/components/Nav/BoardMenu/BoardMenu.styled.tsx` | prop callbacks |
| `src/components/Lists/List.styled.ts` | prop callbacks |
| `src/components/Lists/ListActions/ListActions.styled.ts` | prop callbacks |
| `src/components/Lists/CardTitleDetails/CardTitleDetails.styled.ts` | inline `@keyframes` in template literals |
| `src/components/Cards/Card.styled.ts` | largest file; prop callbacks (`isOpen`); extends `Button`, `CardModalTitle`, `CardActivityColumn`; wraps Radix `Dialog.*`/`Popover.*` |
| `src/components/Cards/CardHeader/CardHeader.styled.ts` | |
| `src/components/Cards/MoveCardMenu/MoveCardMenu.styled.ts` | |
| `src/components/Checklists/Checklists.styled.ts` | |
| `src/components/ChecklistItem/ChecklistItem.styled.tsx` | prop callbacks + `variants:` arrays |
| `src/components/Activity/Activity.styled.tsx` | most definitions in one file (37 `styled` calls) |
| `src/components/shared/Tooltip/Tooltip.styled.ts` | |
| `src/components/shared/Combobox/Combobox.styled.ts` | |
| `src/routes/__root.tsx` | `import '@pigment-css/react/styles.css'` (line 4) |
| `vite.config.ts` | `pigment({})` plugin + pigment-only workarounds (see Phase 5) |

Facts that shape the plan:

- All dynamic styling found is **boolean or enum based** (`isOpen`,
  `background: 'blue' | 'green' | …`). No arbitrary runtime values, so
  `@vanilla-extract/recipes` covers everything; `@vanilla-extract/dynamic`
  should not be needed.
- `pigment({})` has no theme config — there is no theme to port.
- `src/styles/tokens.ts` is pure TS constants — importable from `.css.ts` as-is.
- Plain CSS files (`src/styles/animations.css`, `board-gradient.css`,
  `drag.css`) are outside pigment. Do not touch them.
- E2E tests (`tests/`) use no class-name-based locators (verified by grep), so
  hashed VE class names cannot break them.
- `react-is` (dep + pnpm override) and `@mui/utils` (devDependency) exist only
  as pigment runtime requirements, along with several vite config entries.

## Pattern mappings

### 1. Static styled element (template literal or object)

```ts
// before (Card.styled.ts)
export const CardModalBody = styled.div`
  display: grid;
  ${cardModalBreakpoint} {
    display: flex;
  }
`;
```

```ts
// after — Card.css.ts
export const cardModalBody = style({
  display: 'grid',
  '@media': {
    [cardModalBreakpointQuery]: { display: 'flex' },
  },
});

// after — Card.styled.ts (same export name as before)
export const CardModalBody = styledEl('div', styles.cardModalBody);
```

Media-query interpolations like `${cardModalBreakpoint}` become plain query
strings (without the `@media ` prefix) under the `'@media'` key. Hoist shared
query strings into `tokens.ts`.

### 2. Wrapping Radix / arbitrary components

`styled(Dialog.Content)` → `styledEl(Dialog.Content, styles.cardModalContent)`.
The factory must merge an incoming `className` prop with the bound class and
forward refs.

### 3. Prop callbacks → recipe boolean variants

```ts
// before
export const CardModalActionButton = styled.div<{ isOpen: boolean }>({
  color: (props) => (props.isOpen ? 'white' : 'rgba(9, 30, 66, 0.9)'),
  ...
});
```

```ts
// after — Card.css.ts
export const cardModalActionButton = recipe({
  base: { ... },
  variants: {
    isOpen: {
      true: { color: 'white', background: 'rgba(0, 0, 0, 0.8)' },
      false: { color: 'rgba(9, 30, 66, 0.9)', background: 'transparent' },
    },
  },
});
```

The wrapper factory's recipe form maps the listed variant props into the recipe
call and strips them from the DOM element. Watch for callbacks nested under
selectors (e.g. `'&:hover': { background: (props) => … }`) — those become the
same properties inside the variant's `selectors`/pseudo blocks.

### 4. Pigment `variants:` arrays → recipe variants

Pigment's `variants: [{ props: { background: 'blue' }, style: {…} }]` maps
near-1:1 onto a recipe variant group keyed by `background`. Used in
`Nav.styled.ts`, `Boards.styled.ts`, `ChecklistItem.styled.tsx`.

### 5. Extension chains and shared style objects

- `styled(Button)\`…\`` → wrapper binds `[buttonClass, overrideClass]` (VE
  `style([...])` composition, or the factory accepts an array).
- Spread objects like `...secondaryButtonStyles` → export the fragment as a
  plain `ComplexStyleRule` object from a `.css.ts` (or `tokens.ts`) and compose
  with `style([fragment, {…}])`. `Page.styled.tsx` must be converted first
  because `Card.styled.ts` both spreads `secondaryButtonStyles` and reads
  `secondaryButtonStyles.color`.
- **Ordering caution:** pigment guarantees the extending component's CSS wins.
  VE composition order comes from class order and stylesheet emission order.
  Every extension site (`DescriptionTitle` extends `CardModalTitle`,
  `CardPageActivityColumn` extends `CardActivityColumn`,
  `SaveDescriptionButton`/`CloseDescriptionButton`/`EditDescriptionButton`
  extend `Button`) needs a visual check after conversion. If an override loses,
  make the override style self-sufficient rather than fighting specificity.

### 6. Keyframes

Inline `@keyframes name {…}` blocks (`CardTitleDetails.styled.ts`) become
`const slideDown = keyframes({ from: {…}, to: {…} })` and are referenced by the
returned name. Animations that reference Radix vars
(`var(--radix-accordion-content-height)`) carry over unchanged as strings.

### 7. Globals

`GlobalFonts.ts` → `src/styles/global.css.ts` using `globalFontFace('App Sans',
{…})` and `globalStyle('html', {…})` / `globalStyle('body', {…})`. Import it
from `__root.tsx`. Delete the `GlobalFonts` null component and its render site.
The `import '@pigment-css/react/styles.css'` line is deleted only in Phase 5,
after the last pigment file is gone.

## The `styledEl` factory

Create `src/styles/styledEl.tsx` (name at implementer's discretion). Required
behavior:

- `styledEl(tagOrComponent, className)` → component rendering the tag/component
  with the bound class merged with any incoming `className`, ref forwarded, all
  other props passed through.
- `styledEl(tagOrComponent, recipeFn, variantKeys)` → same, but calls the
  recipe with the picked variant props and **omits those props from the DOM**
  (pigment did this automatically; leaking `isOpen` onto a `div` will produce
  React unknown-prop warnings).
- Keep TypeScript prop types equivalent to what pigment produced so consumer
  files typecheck without edits (`styled.div<IsOpenProps>` →
  wrapper generic carrying the variant props).

## Phases

Run `pnpm test:types` and `pnpm lint:check` after every phase; run the e2e
suite (`pnpm test`) after each conversion batch in Phase 4.

### Phase 0 — compatibility spike (go/no-go gate)

The single real risk: the VE Vite plugin under **Vite 8 + TanStack Start with
RSC enabled + the Netlify plugin + Sentry plugin** (see `vite.config.ts`
plugin order). Do this before any conversion:

1. `pnpm add -D @vanilla-extract/css @vanilla-extract/vite-plugin @vanilla-extract/recipes`
2. Add `vanillaExtractPlugin()` to `vite.config.ts` alongside `pigment({})`.
3. Create a throwaway `spike.css.ts` with one `style()`, apply it on an
   existing route element.
4. Verify: `pnpm dev` renders it and HMR works on editing the `.css.ts`;
   `pnpm build` succeeds and the class appears in emitted CSS; SSR output
   includes the stylesheet (no flash of unstyled content on a hard reload).
5. Delete the spike element/file. If any of this fails, **stop** and report —
   the rest of the plan is blocked on upstream compatibility.

### Phase 1 — infrastructure

1. Build `styledEl` per the spec above.
2. Create `src/styles/global.css.ts`; wire into `__root.tsx`; remove
   `GlobalFonts` usage and file.
3. Re-home cross-file style values so `.css.ts` files never import from
   `.styled` files: move `fontFamily` consumption in `Card.styled.ts` off the
   `Boards.styled` re-export onto `~/styles/tokens` directly (it originates
   there already). Audit for other `.styled` → `.styled` value imports.

### Phase 2 — shared foundations

Convert `src/styles/Page.styled.tsx` (exports `Button`,
`secondaryButtonStyles` used by Cards). Then `shared/Tooltip`,
`shared/Combobox`.

### Phase 3 — boards and nav

`Boards.styled.ts`, `Board.styled.ts`, then `Nav.styled.ts` +
`BoardMenu.styled.tsx` (recipe variants for the `background` enum; keep the
variant prop names identical so consumers don't change).

### Phase 4 — the rest, one directory per batch, e2e green between batches

1. `Lists/List.styled.ts`, `Lists/ListActions/ListActions.styled.ts`
2. `Lists/CardTitleDetails/CardTitleDetails.styled.ts` (keyframes)
3. `Cards/Card.styled.ts`, `Cards/CardHeader/CardHeader.styled.ts`,
   `Cards/MoveCardMenu/MoveCardMenu.styled.ts` (largest batch — extension
   chains and Radix wrapping; do the visual pass on the card modal at desktop
   and the 850px breakpoint)
4. `Checklists/Checklists.styled.ts`, `ChecklistItem/ChecklistItem.styled.tsx`
5. `Activity/Activity.styled.tsx`

Per-file procedure: create `X.css.ts` with converted definitions; rewrite
`X.styled.ts` to factory wrappers with identical export names; confirm zero
edits needed in consumer files (`git diff --stat` should show only the pair);
typecheck, lint, e2e.

### Phase 5 — teardown

1. Delete `import '@pigment-css/react/styles.css'` from `__root.tsx`.
2. `pnpm remove @pigment-css/react @pigment-css/vite-plugin`.
3. In `vite.config.ts`: remove `pigment({})` and its import; remove
   `@pigment-css/react`, `@mui/utils/deepmerge`, and `react-is` from
   `optimizeDeps.include`, `ssr.noExternal`, and `ssr.optimizeDeps.include`
   (keep the `react-icons` and pg/prisma/radix entries — those are unrelated);
   update the stale comment that references pigment chunks.
4. Verify nothing else imports `react-is` or `@mui/utils`
   (`grep -r "react-is\|@mui/utils" src`), then `pnpm remove @mui/utils`,
   remove the `react-is` devDependency and the `pnpm.overrides` entry for it,
   and remove the `react/jsx-runtime.js` aliases only if they were
   pigment-motivated (test dev + build after removing; restore if anything
   breaks).
5. Full verification: `pnpm test:types`, `pnpm lint:check`, `pnpm build`,
   `pnpm test:all` if browsers are installed (else `pnpm test`).

## Risks

- **Phase 0 failure** (VE plugin vs. Vite 8/RSC/Netlify) blocks everything;
  that is why it runs first and costs half a day at most.
- **Specificity/order flips at extension sites** — see mapping §5. Mitigation:
  visual pass per batch, make overrides self-sufficient.
- **Template → object conversion volume** (~250 definitions) is mechanical but
  error-prone in the details: shorthand vs. longhand conflicts (`padding`
  appearing twice in `CardActivityColumn` is intentional last-wins in CSS text
  but an object key collision in VE — resolve to the effective value),
  duplicated selectors, string units.
- **Leaked variant props** if the factory's omit list misses one — watch the
  browser console for unknown-prop warnings during the visual pass.

## Definition of done

- `grep -r "@pigment-css" src vite.config.ts package.json` returns nothing.
- `pnpm test:types`, `pnpm lint:check`, `pnpm build`, and the Playwright suite
  all pass.
- No visual regressions on: boards index, board page (each background color
  variant), card modal (desktop + ≤850px), checklists expand/collapse
  animations, activity feed, nav menus.
- All changes left unstaged for review.
