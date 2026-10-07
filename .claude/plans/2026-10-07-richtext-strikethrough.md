# Rich text strikethrough toolbar button: implementation plan

Branch: `next`. Small change, five files.

## Where things stand

Strikethrough already works everywhere except the toolbar:

| Layer | State | Where |
| --- | --- | --- |
| Markdown shortcut `~~text~~` | ✅ | `STRIKETHROUGH` in `RichText.transformers.ts` |
| Editor theme class | ✅ | `richTextTheme.text.strikethrough` / `underlineStrikethrough` in `RichText.constants.ts` |
| Styles (editor + saved) | ✅ | `s, .rich-text-strikethrough`, `.rich-text-underline-strikethrough` in `RichText.styled.ts` |
| Saved-value render | ✅ | `renderText` wraps in `<s>` in `RichTextContent.tsx` |
| Markdown preview export | ✅ | same transformer list |
| Help dialog row | ✅ | `MARKDOWN_SHORTCUTS` |
| e2e for `~~` | ✅ | `tests/richtext.test.ts` "formats inline markdown as it is typed" |
| **Toolbar button + active state** | ❌ | `TEXT_FORMAT_BUTTONS`, `TextFormat`, `initialToolbarState`, `syncToolbar` |

So the job is a toolbar button that sits next to Bold / Italic / Underline,
toggles `FORMAT_TEXT_COMMAND 'strikethrough'`, and shows `aria-pressed` /
`$active` for the current selection. Lexical's `FORMAT_TEXT_COMMAND` already
accepts `'strikethrough'`, so nothing new is needed on the editor side.

## Changes

### 1. `src/components/shared/RichText/RichText.types.ts`

Widen the toolbar's format union:

```ts
type TextFormat = 'bold' | 'italic' | 'underline' | 'strikethrough';
```

`TextFormatButton.format` picks this up automatically.

### 2. `src/components/shared/RichText/RichText.constants.ts`

- Import `FaStrikethrough` from `react-icons/fa`. It's already installed and
  matches the other `Fa*` format icons.
- Add the fourth entry to `TEXT_FORMAT_BUTTONS`, after Underline:
  ```ts
  { format: 'strikethrough', label: 'Strikethrough', Icon: FaStrikethrough },
  ```
- Add `strikethrough: false` to `initialToolbarState.formats`.

`toolbar.formats[format]` in the toolbar is indexed by `TextFormat`, so steps 1–2
have to land together or `pnpm test:types` fails. That failure is useful: it
confirms the button can't be added without its state.

### 3. `src/components/shared/RichText/RichTextToolbar.tsx`

In `syncToolbar`, add to `selectionState.formats`:

```ts
strikethrough: selection.hasFormat('strikethrough'),
```

Nothing else changes. The `TEXT_FORMAT_BUTTONS.map(...)` already renders the
button, wires `keepSelection`, `aria-pressed`, `$active`, and dispatches
`FORMAT_TEXT_COMMAND` with `format`.

### 4. Styles: no change expected

The toolbar button reuses `RichTextToolbarButton`, and strikethrough text is
already painted. Things to check when render-verifying:

- **Toolbar wrap.** The format group goes from 3 to 4 buttons (+30px). The row
  is `flex-wrap: wrap` and groups stay intact, but the comment editor in
  `AddComment` / `EditCommentForm` is narrower than the description editor.
  Look at both at desktop width and at ~375px mobile width to confirm the wrap
  still looks deliberate.
- **Underline + strikethrough together.** Lexical switches to the
  `underlineStrikethrough` theme class when both are set. The class exists and
  is styled. Toggle both on one word in the editor, then save and confirm the
  saved view (`<s><u>…</u></s>`) shows both lines.

### 5. Help dialog: optional, ask first

`MARKDOWN_SHORTCUTS` already lists `~~Strikethrough~~`. There is no keyboard
shortcut to add: Lexical core binds only Cmd/Ctrl + B / I / U
(`Lexical.dev.js` default key bindings), with nothing for strikethrough.

**Out of scope unless the user asks:** adding a Cmd/Ctrl+Shift+X shortcut
(the Lexical playground and Google Docs convention). It would need a
`KEY_DOWN_COMMAND` handler in a small plugin next to `EscapePlugin`, plus a new
help-dialog section. It's a separate feature from "a strikethrough option in
the toolbar".

## Test: `tests/richtext.test.ts`

The toolbar format buttons have no e2e coverage today (only the markdown paths
are tested). Add one test to the `Rich text markdown` describe block (or a new
`Rich text toolbar` describe in the same file, using the same `CardPage`
fixture):

```ts
test('toggles strikethrough from the toolbar', async () => {
  const editor = await cardPage.openDescriptionEditor();
  const strikethrough = cardPage.page.getByRole('button', {
    name: 'Strikethrough',
  });

  await expect(strikethrough).toHaveAttribute('aria-pressed', 'false');

  await strikethrough.click();
  await expect(strikethrough).toHaveAttribute('aria-pressed', 'true');
  await editor.pressSequentially('Gone');

  await strikethrough.click();
  await expect(strikethrough).toHaveAttribute('aria-pressed', 'false');
  await editor.pressSequentially(' kept');

  await expect(editor.locator('.rich-text-strikethrough')).toHaveText('Gone');

  await cardPage.saveDescription();

  const description = cardPage.page.getByTestId('CardDescriptionText');

  await expect(description.locator('s')).toHaveText('Gone');
  await expect(description).toContainText('Gone kept');
});
```

Notes:

- Toggle with the caret collapsed and then type. It avoids needing a
  select-text helper and covers the same `FORMAT_TEXT_COMMAND` path. If you
  also want to cover the selection path, `editor.press('Shift+Home')` after
  typing works in Lexical and doesn't depend on platform modifiers.
- `aria-pressed` tracking the selection proves `syncToolbar` was updated, not
  just the button list.
- The `getByRole('button', { name: 'Strikethrough' })` locator doesn't clash
  with the help dialog's "Strikethrough" row, because that row isn't a button
  and the dialog is closed.
- Watch for the pre-hydration fill wedge (memory): `openDescriptionEditor`
  already waits for the interactive trigger, so clicking a toolbar button after
  it is safe.

## Gates

1. `pnpm test:types`
2. `pnpm lint:check` (not `lint:fix`, which carries `--unsafe`)
3. `pnpm test tests/richtext.test.ts` (chromium), then
   `pnpm test:webkit tests/richtext.test.ts` and
   `pnpm test:mobile:safari tests/richtext.test.ts`. Don't run these while
   another e2e run holds the dev ports.
4. Render-verify in the running app: card description editor and comment
   editor, desktop and mobile widths. Check that the button is in the format
   group, its active state, toolbar wrap, and the underline + strikethrough
   combination before and after saving.

## Out of scope

- Keyboard shortcut (see §5).
- Any refactor of the toolbar or format handling.
- Strikethrough in non-RichText inputs (card titles, checklist items).
