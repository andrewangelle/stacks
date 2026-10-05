# Five UX fixes — implementation plan

Branch: `next`. Order is cheapest → largest. Items 1 and 5 both touch
`CreateBoard.tsx`, so do 5 after 1 (or fold 1's CreateBoard change into 5).

Ground rules from memory/CLAUDE.md that apply to all of these:

- Ship e2e coverage in `tests/` with each item.
- Testids stay on every styled component (`.attrs<DataAttributes>`); don't rename
  existing ones that tests use.
- Render-verify every visual change (items 2, 3, 5) — look at it, don't just pass gates.
- Gates: `pnpm test:types`, `pnpm lint:check` (never `lint:fix` — it carries
  `--unsafe`), targeted `pnpm exec playwright test <file> --project="<name>"`
  (or `pnpm test:webkit <file>` / `pnpm test:mobile:safari <file>`; `pnpm test`
  is chromium).
- No drive-by refactors; no comment on every change.

---

## 2. Switch Boards: empty search renders `0`

**Cause** — `src/components/DisplayMenu/SwitchBoards/SwitchBoards.tsx`:

```tsx
{matchingBoards.length && ( <SwitchBoardsGrid …/> )}
```

With zero matches `0 && …` evaluates to `0`, and React renders the number. The
existing empty message renders underneath it, so the user sees `0` followed by
`No boards match "…".`

**Change**

1. Make the condition boolean: `matchingBoards.length > 0 && (…)`.
2. Change the search-miss copy to `No results`. Keep `You have no other boards.`
   for the no-search case (user didn't ask to change that).

**Test** — `tests/board.test.ts` (the "nothing matches" step, ~line 150) already
asserts `SwitchBoardsEmpty` is visible but never caught the `0`. Tighten it:

- `expect(getByTestId('SwitchBoardsEmpty')).toHaveText('No results')`
- assert there is no stray `0` text node. The `0` is a bare text node between
  `SwitchBoardsSearchField` and `SwitchBoardsEmpty`, and `SwitchBoardsContent`'s
  text starts with the "Switch boards" title, so neither `^\s*0` nor
  `previousElementSibling` (skips text nodes) can catch it. Check the node:
  evaluate `SwitchBoardsEmpty` and assert `el.previousSibling` is the
  `SwitchBoardsSearchField` element (`previousSibling` includes text nodes). Do
  not use a `/0\s*No results/` content regex: the current miss text is
  `No boards match "…".` and never says "No results", so it passes on broken code.
- Run the `previousSibling` assertion against the current code first, before
  changing the copy, and confirm it fails (the `toHaveText('No results')` check
  would fail on the copy alone and says nothing about the `0`). Then apply the fix.

---

## 3. "All tasks completed!" not centered on mobile

**Likely cause** — `AllTasksCompletedContainer` in
`src/components/Lists/CardTitleDetails/CardTitleDetails.styled.ts` (~line 421)
relies on `width: stretch` to fill the card. Its parent `ListCardContainer`
(`src/components/Lists/List.styled.ts:171`) is `flex-direction: column;
align-items: start`, so without a working `width: stretch` the container
shrink-wraps to its content and sits at the left edge. WebKit doesn't support
the unprefixed `stretch` keyword (only `-webkit-fill-available`), which matches
"broken on mobile" (iOS Safari).

**Verify before changing** — the container only exists while
`showAllCompleteView` is true (`CardTitleDetailsContent.tsx:91`). That flag is set
by `onCompleteAllItems` (`:144`) when the last item is ticked in the checklist
preview on the list card, and a 2000 ms timer clears it (`:67-76`). A card whose
items were already done shows nothing, and the card modal never shows it. So in
the `Mobile Safari` / `webkit` project, tick the last item on the list card and
measure within that 2 s window, comparing `AllTasksCompletedContainer`'s
width to `ListCardContainer`'s inner width. If they're equal the cause is
something else (e.g. a mobile-only rule) — re-diagnose rather than patching.

**Change** (if confirmed) — replace `width: stretch` with `align-self: stretch`
on `AllTasksCompletedContainer`. That overrides the parent's `align-items: start`
in every engine and needs no `box-sizing` math around the 12px padding.

`AllTasksCompletedText` has `text-align: left`; fine for a one-line label, but
if the text wraps on narrow cards it will look off-center — switch to `center`
only if the render check shows wrapping.

Out of scope: the other `width: stretch` uses (`List.styled.ts:153`,
`CardTitleDetails.styled.ts:279`, `MoveCardMenu.styled.ts:80`,
`Board.styled.ts:62`) likely have the same WebKit issue. Note them to the user;
don't fix unasked.

**Test** — extend the existing test in `tests/list.test.ts` (~lines 85-115) that
ticks `CardTitleDetailsChecklistCheckbox` and asserts the container is visible.
Right after its `toBeVisible()` assertion, measure and assert the container's
horizontal center is within ~1px of `ListCardContainer`'s center (boundingBox
math). Measuring immediately keeps it inside the 2 s window, which matters on
slow CI WebKit (see `.claude/CLAUDE.md`). The 250 ms reveal animation scales from
the center, so a horizontal-center comparison is still valid mid-animation. Run
on `webkit` and `Mobile Safari` specifically — those are where it fails.

---

## 1. Enter saves in every non-WYSIWYG input

### Inventory

| Component | Element | Current Enter behavior | Save action |
|---|---|---|---|
| `Lists/AddNewCard.tsx` | `input` | nothing | `onCardCreate` |
| `Lists/AddNewCardAtPosition.tsx` | `input` | nothing | `onCardCreate` |
| `Lists/AddList.tsx` | `input` | nothing | `onListCreate` |
| `Lists/EditableListName.tsx` | `input` (no CTA; saves on blur) | nothing | `onOutsideNameEditClick` |
| `Nav/BoardHeader.tsx` | `input` in `<form>` (saves on blur) | **implicit form submit** | `onOutsideNameEditClick` |
| `Cards/CardEditableTitle.tsx` | `input` in `<form>` (saves on outside click) | **implicit form submit** | `onOutsideTitleEditClick` |
| `Checklists/ChecklistEditableTitle.tsx` | `input` in `<form>` (outside click) | **implicit form submit** | `onOutsideTitleEditClick` |
| `Checklists/CreateChecklist.tsx` | `input` | nothing | `addChecklist` |
| `ChecklistItem/AddChecklistItem.tsx` | `textarea` | newline | `createItem` |
| `ChecklistItem/EditableChecklistLabel.tsx` | `textarea` | newline | `addChecklistItem` |
| `Boards/CreateBoard.tsx` | `input` | nothing (and `onBoardCreate` doesn't close the popover today; see item 5) | `onBoardCreate` |
| `Lists/EditCardPopover/EditCardTitle.tsx` | `textarea` | **already saves** | — (reference pattern) |

Excluded:

- **WYSIWYG** (per the request): `RichTextEditor` in `Activity/AddComment.tsx`,
  `Activity/EditCommentForm.tsx`, `Cards/CardDescription/CardDescription.tsx`.
- **Not save inputs**: `SwitchBoards` search (filters live) and
  `shared/Combobox` (Enter already selects the highlighted option via downshift).

The three `<form>`s with no `onSubmit` are the risky rows: a form with a single
text input submits implicitly on Enter, which does a GET navigation to the
current URL (`?boardTitle=…` for BoardHeader) — i.e. a full page reload and a
lost edit. Confirm this in the browser first; either way the fix below stops it.

### Approach

Add one small helper and use it everywhere, matching `EditCardTitle`'s existing
logic (Enter without Shift → `preventDefault` + save):

```ts
// src/utils/keyboard.ts
import type { KeyboardEvent } from 'react';

export function onEnter(
  save: (input: HTMLInputElement | HTMLTextAreaElement) => void,
) {
  return (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    if (event.currentTarget.value.trim()) {
      save(event.currentTarget);
    }
  };
}
```

- Blank or whitespace-only input skips the save (see "Blank input" below).
- `preventDefault` also blocks the implicit form submission, so the three forms
  need no separate `onSubmit`.
- `isComposing` keeps Enter from firing a save while an IME (Japanese, Chinese,
  Korean input) is confirming a candidate.
- Shift+Enter still inserts a newline in the two textareas.

Wire it per component as `onKeyDown={onEnter(<save action>)}`. Two wrinkles:

- **Blur-save inputs** (`EditableListName`, `BoardHeader`): they already save
  in `onBlur`. Calling the save function *and* letting the input unmount can
  double-fire if the browser emits blur on removal. Use
  `onEnter((input) => input.blur())` — the helper passes the element to the
  callback, so no ref is needed (`EditableListName` already uses
  `ref={outsideClickRef}` on that input, which would otherwise need a merged
  ref). Blur the input and let the existing `onBlur` path do the single save.
  Callers that don't need the element just ignore the argument.
- **Outside-click inputs** (`CardEditableTitle`, `ChecklistEditableTitle`): no
  `onBlur`, so call `onOutsideTitleEditClick` directly. Rename isn't required —
  but if it reads badly at the call site, extract a `saveTitle()` that both the
  outside-click handler and Enter call.

Don't migrate `EditCardTitle.tsx` to the helper — it works, and that would be a
drive-by.

### Blank input: Enter does nothing (decided)

The CTAs for add-card, add-list, create-checklist and add-checklist-item don't
guard against an empty title — clicking them with nothing typed creates an
empty entity. Enter would make that easy to hit by accident, so **Enter does
nothing when the input is blank or whitespace-only**:

- `preventDefault` still runs (so the three forms never submit/reload), but
  `save` is skipped. The input stays open and focused.
- Put the check in the helper so every caller gets it:

  ```ts
  import type { KeyboardEvent } from 'react';

  export function onEnter(
    save: (input: HTMLInputElement | HTMLTextAreaElement) => void,
  ) {
    return (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (event.key !== 'Enter' || event.shiftKey || event.nativeEvent.isComposing) {
        return;
      }
      event.preventDefault();
      if (event.currentTarget.value.trim()) {
        save(event.currentTarget);
      }
    };
  }
  ```

- For the blur-save inputs (`EditableListName`, `BoardHeader`), a blank Enter
  therefore doesn't blur, so it doesn't save either. `BoardHeader`'s blur path
  already ignores blank titles; `EditableListName`'s doesn't, but clicking away
  with a blank name is the existing CTA-equivalent path and stays as is.
- The CTAs themselves are unchanged — clicking with an empty title behaves
  exactly as it does today. (Ask before adding guards there; it's out of scope.)

Test addition: for each add-style input, press Enter on an empty and on a
whitespace-only value and assert nothing was created and the input is still
open.

### Test

New `describe('Enter to save')` blocks in the existing per-area files
(`list.test.ts`, `card.test.ts`, `checklist.test.ts`, `board.test.ts`,
`boards.test.ts`): for each row in the inventory, fill, press `Enter`, assert
the saved value is rendered and the input closed. `Boards/CreateBoard.tsx` only
closes after item 5's change (`onBoardCreate` calls `handleOpenChange(false)`), so
its "input closed" assertion depends on item 5; do 5 before finalizing that row,
or assert only that the new `BoardCardTitle` appears until then. For the three forms also
assert `page.url()` is unchanged (catches the reload). For the textareas, assert
Shift+Enter inserts a newline and does not save.

Per memory: if an input is filled before hydration the submit wedges — use the
existing hydration-ready helpers and clear before re-filling.

---

## 4. Add-card input scrolls into view on mobile

**Suspected cause (unconfirmed)** — clicking `+ Add a card` in
`Lists/AddNewCard.tsx` flips `AddCardFooter` from `position: sticky` to `static`
(`[data-editing]`), so the input lands at the bottom of the list's scroll
content. But `AddCardInput` has `autoFocus` (`AddNewCard.tsx:58`), and React
focusing it on mount already scrolls it into view inside its scroll container
(`ListContainer`, `overflow: auto`). So in emulated mobile the input is probably
already in view, and an added `scrollIntoView` effect could do nothing. The
remaining suspect is the on-screen keyboard covering the input (step 3), which
only a real device can show. The board also scrolls horizontally, so a list
that's partly off-screen may stay partly off-screen.

**Step 0 — reproduce first (gate for steps 1–2).** Write the test below and run
it on `Mobile Safari` against the current code. Only do steps 1–2 if it fails.
If it passes, don't ship steps 1–2 (they'd be a fix that does nothing); the
problem is likely the keyboard covering the input, which can only be checked on
a real device — report that to the user and treat step 3 as the candidate fix,
verified there.

**Change** (only if the step 0 test fails)

1. Put a ref on `AddCardFooter` (or the input).
2. When `isAddingCard` becomes true and `useIsMobile()` is true, call
   `scrollIntoView({ block: 'end', inline: 'nearest', behavior: 'smooth' })` in
   an effect. `CardTitleDetails.tsx:84` already does this for the edit popover;
   mirror its shape.
3. iOS opens the keyboard after focus, shrinking `visualViewport` but not the
   layout viewport, so the first scroll can land under the keyboard. Listen once
   for `visualViewport` `resize` while adding and re-run the scroll; remove the
   listener when `isAddingCard` goes false.

Verify step 3 is actually needed on a real device (or at least Mobile Safari)
before keeping it — if step 2 alone lands correctly, drop it.

Scope: `AddNewCard` only. `AddNewCardAtPosition` is hover-triggered and doesn't
appear on touch; leave it.

**Test** — mobile projects only (`test.skip(!isMobile)`; `isMobile` is a
built-in Playwright fixture and doesn't depend on `tests/fixtures.ts`, or use
`testInfo.project.name`). Seed a list with enough cards to overflow, click
`+ Add a card`, assert `AddCardInput` is within the viewport
(`toBeInViewport()`). Don't sample scroll frames (see CLAUDE.md on CI WebKit
rAF gaps) — assert the end state.

The test must use the `test` from `~test/fixtures`, not `@playwright/test`:
the `clampMobileViewport` fixture (`{ auto: true }`, `tests/fixtures.ts:69`)
stops mobile emulation zooming the page out to ~614px, and without it
`toBeInViewport()` doesn't reflect a real phone and can pass without the fix.
`tests/list.test.ts` imports `test` from `@playwright/test`, so don't just add it
there: either import the fixtures `test` under a separate alias in
`list.test.ts` (e.g. `import { test as fixtureTest } from '~test/fixtures'`) and
use it for this test only, or put the test in a file that already uses the
fixtures (`card.test.ts`, `checklist.test.ts`, `activity.test.ts`,
`richtext.test.ts`). Don't switch all of `list.test.ts` to the fixtures import —
that would change how its existing tests behave on mobile.

---

## 5. Create Board popover matches Move List / Move Card menus

**Target look** (from `MoveCardMenu.styled.ts`, `ListActions.styled.ts`,
`Combobox.styled.ts`):

- Content: 350px wide, 8px radius, white, no border, the shared shadow
  `0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F`, `fontFamily`, 14px.
  Positioned `side="bottom" align="start" sideOffset={8} alignOffset={4}` like
  `MoveCardFields`.
- Header: `MoveCardMenuHeader` style — centered, 600 weight, `rgba(9,30,66,.75)`,
  10px padding, `PopoverClose` "X" on the right, `CreateBoardCloseBorder` hr below.
- Field labels: `ComboboxLabel` style (12px, 700, `0 10px 6px` padding).
- Title input: a single `<input>` modeled on the `ComboboxTrigger` /
  `ComboboxInput` pair (neither alone matches: `ComboboxTrigger` has
  `padding: 0 4px 0 8px`, the `12px 0` padding is on `ComboboxInput`) — full
  width minus 20px, 1px `rgba(9,30,66,0.8)` border, 4px radius, roughly
  `padding: 12px 8px`, and a `:focus` border color of `focusRingBlue` (the
  Combobox focus style is a `:focus-within` border color, not a ring).
- Background swatches: keep, but align to the 10px side gutter.
- Create button: `styled(Button)` like `MoveListButton` — `calc(100% - 20px)`,
  `margin: 8px 10px 10px` (deliberate change from `MoveListButton`'s
  `8px 10px 0px`, for bottom spacing in the popover), `padding: 10px 20px`, 500 weight; disabled state from
  `Button`.

**Change**

- Put the composed styles in a **new** `src/components/Boards/CreateBoard.styled.ts`,
  not `Boards.styled.ts`. `MoveCardMenu.styled.ts:3` and `Combobox.styled.ts:2`
  both import `fontFamily` from `~/components/Boards/Boards.styled`, so
  `styled(MoveCardMenuContent)` / `styled(ComboboxLabel)` inside `Boards.styled.ts`
  would create a circular import and crash depending on load order
  (`ReferenceError` / "Cannot create styled-component for component: undefined").
  The new file imports from `MoveCardMenu.styled`, `Combobox.styled` and
  `~/styles/Page.styled` (`Button`); nothing imports it except `CreateBoard.tsx`,
  so there is no cycle. It may also import the shared `PopoverClose`,
  `CreateBoardCloseBorder` and background-swatch styles from `Boards.styled.ts`
  (one-way, no cycle). Reuse before inventing: compose from `MoveCardMenuContent`
  / `MoveCardMenuHeader` / `ComboboxLabel` / `Button` rather than copying CSS.
  Keep every existing testid (`CreateBoardPopoverContent`, `CreateBoardTitleInput`,
  `CreateBoardButton`, `CreateBoardBackgroundChoice`, …) by re-adding it with
  `.attrs<DataAttributes>` on each composed component — `tests/boards.test.ts`
  uses them. Update `CreateBoard.tsx` imports accordingly.
- Header copy: `Create board` (sentence case, matching "Move card"/"Move list").
- Remove the old `CreateBoardPopoverContent`, `CreateBoardPopoverHeader`,
  `CreateBoardBackgroundText`, `CreateBoardTitleInput` and `CreateBoardButton`
  from `Boards.styled.ts` once moved/replaced — grep shows only `CreateBoard.tsx`
  uses them (re-grep before deleting). `PopoverClose` and `CreateBoardCloseBorder`
  are shared — keep.

**Behavior matches the Move menus too (decided)** — `CreateBoard` is
controlled with `open` but no `onOpenChange`, so today Escape and outside clicks
don't close it. Match `MoveCardMenu`:

- Add a single `handleOpenChange(next: boolean)` that calls `setCreateOpen(next)`
  and, when `next` is false, clears `boardTitle` and `selectedColor`. Use it as
  `<Popover.Root open={isCreateOpen} onOpenChange={handleOpenChange}>`.
- Drop the manual `onClick` toggle on `CreateBoardCard`; `Popover.Trigger`
  handles open/close.
- Drop the `onClick` on `PopoverClose`; `Popover.Close` closes through
  `onOpenChange`.
- Reset `boardTitle` and `selectedColor` when it closes, so reopening starts
  clean (the Move menus remount their fields on open, so they get this for free).
  Do it in `handleOpenChange`, not an effect.
- **Creating a board closes the popover (decided).** Today `onBoardCreate`
  (`CreateBoard.tsx:36-45`) only calls `createBoard(...)`, so the popover and
  title input stay open after Enter or the Create button. Make it close, like the
  Move menus: call `handleOpenChange(false)` at the end of `onBoardCreate`. Radix
  only fires `onOpenChange` for user-initiated closes, not when `open` is set
  directly, so calling `setCreateOpen(false)` alone would leave the old title and
  color in state; routing through `handleOpenChange` resets them.

**Mobile** — `/boards` on mobile is a full-width row list; a 350px popover
needs Radix's collision handling to stay on-screen at 375px. Render-check on
`Mobile Safari`; add `collisionPadding` if it clips.

**Test** — extend `tests/boards.test.ts` "creates a board": also create via
Enter (item 1), and that Enter on an empty title creates nothing. Add a test that
Escape and an outside click each close the popover, and that reopening it shows
an empty title input. Also assert that creating a board (Enter and the Create
button) closes the popover, and that reopening after a create shows an empty
title and the default color.

---

## Verification checklist

- [ ] `pnpm test:types` and `pnpm lint:check` clean
- [ ] Rendered check: SwitchBoards empty state, all-tasks-completed on mobile,
      Create Board popover desktop + mobile
- [ ] New/updated e2e pass on the browsers each item targets (webkit /
      Mobile Safari for 3 and 4)
- [ ] Changes left unstaged in the main checkout for review
