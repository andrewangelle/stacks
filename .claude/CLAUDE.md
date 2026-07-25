# stacks

## Styling conventions (vanilla-extract)

Styles live in `*.css.ts` files; components consume them through thin wrappers
in the sibling `*.styled.ts(x)` file built with `styledEl` / `buttonEl` from
`~/styles/styledEl` and `~/styles/Page.styled`.

- **Register every new `.css.ts` file in `src/styles/stylesheets.ts`.** That
  barrel is imported by the root route so all CSS lands in the entry chunk in
  one deterministic order. A file missing from it gets chunked per-route and
  loads in navigation order.
- **Cross-file overrides must not rely on stylesheet order.** When a
  `style([base, override])` composition overrides a property the base also
  sets, and the base class lives in a different file, scope the override
  declarations to a compound selector — see `listActionsPopoverClose` in
  `ListActions.css.ts`:

  ```ts
  style([base, { selectors: { [`&${base}`]: { /* overrides */ } } }])
  ```

  Two classes beat one regardless of load order. Same-file compositions don't
  need this. If the base is itself a composition, bump against
  `base.split(' ')[0]` (its own class).
- **Recipes only receive their declared variants.** `styledEl` picks variant
  props via the recipe's `.variants()`; composed plain style functions fall
  back to the omit list. Never pass a full props object into a recipe — the
  recipes runtime throws on unknown keys.
- **`styledEl` omit lists must cover every styling-only prop** (e.g. `isOpen`,
  `background`) so they stay off the DOM. Props the element genuinely needs
  (`disabled`, Radix `checked`) are not omitted even when they are also
  variants.
- **New components take `className` from `.css.ts` exports directly.** Don't
  add new `styledEl` wrappers; the wrapper layer exists for pre-migration call
  sites and should shrink by attrition.

Shared style fragments (plain objects, not classes) live in
`~/styles/mixins.ts`; design tokens in `~/styles/tokens.ts`. Global styles are
`src/styles/global.css.ts`. See `VANILLA_EXTRACT_MIGRATION.md` for the full
pattern mappings and history.
