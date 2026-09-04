# Edit List Card Dialog — Implementation Plan

## Overview

Add a pencil-icon button to each list card that appears on hover/focus. Clicking it opens a Radix Popover anchored to the card with an editable title field, a Save button, and four action options: Open Card, Move, Copy Link, Archive.

---

## 1. New component: `EditCardPopover`

**Path:** `src/components/Lists/EditCardPopover/EditCardPopover.tsx`

A self-contained Radix `Popover.Root` that owns its open/close state.

### Props

```ts
type EditCardPopoverProps = {
  cardId: string;
  listId: string;
  title: string;
  visible: boolean; // controlled by parent hover/focus state
};
```

### Trigger — the pencil icon

- Render a `Popover.Trigger` (styled, see §2) containing a pencil icon (`LuPencil` from `react-icons/lu` — closest match to the screenshot's edit-pencil glyph; or `BiEditAlt` from `react-icons/bi`).
- Wrap the trigger in the existing `<Tooltip content="Edit card">` component.
- The trigger is visible only when `visible` is true **or** the popover is open. Use a `data-visible` attribute (same pattern as `CardCompletedIndicatorCircle`) to drive CSS opacity/width transitions.
- The trigger must call `event.preventDefault()` and `event.stopPropagation()` in its `onClick` so the card modal click handler on the parent `CardModalTrigger` does not fire.

### Popover content — multi-view pattern (follows `ListActions`)

State: `const [view, setView] = useState<'actions' | 'move'>('actions');`

Reset `view` to `'actions'` in `onOpenChange` when closing (same pattern as `ListActions.closePopover`).

#### `view === 'actions'`

Two sections stacked vertically:

**A. Editable title area**

- A `<textarea>` (or `<input>`) pre-filled with `title`, auto-focused and text-selected on open.
- A **Save** button below it. On click:
  1. Call `useUpdateCard()` with `{ cardId, listId, cardTitle: editedTitle }`.
  2. Close the popover.
- If the title is unchanged from the prop, Save is a no-op (still closes).

**B. Action options list** (styled like `ListActionsOption` buttons)

| Label | Icon | Behavior |
|-------|------|----------|
| **Open card** | — | Call `openCardModal()` from `useCardModalTrigger` (already available in parent scope — pass as prop, or pass the navigate call). Close popover. |
| **Move** | `→` | `setView('move')` |
| **Copy link** | `GoPaperclip` / `AiOutlineCheck` | Copy `${window.location.origin}/card/${cardId.slice(0, 8)}` to clipboard. Swap icon to green `AiOutlineCheck` for 2 s, then animate back. Do **not** close the popover. |
| **Archive** | — | Call `useDeleteCard()` with `{ cardId, listId }`. Close popover. |

#### `view === 'move'`

Render the existing `<MoveCardFields id={cardId} />` inside a `<Suspense>` (same as `MoveCardMenu`). Show a back-arrow button that returns to `'actions'` view (same pattern as `ListActions`).

### Copy Link icon animation

Local state:
```ts
const [isCopied, setIsCopied] = useState(false);
```
On click → `setIsCopied(true)`, `navigator.clipboard.writeText(...)`.
`useEffect`: when `isCopied` becomes true, `setTimeout(() => setIsCopied(false), 2000)` (clear on unmount).
Render `AiOutlineCheck` (green) when `isCopied`, else `GoPaperclip`. Wrap in a container with `transition: opacity 150ms` for a cross-fade.

---

## 2. New styled components: `EditCardPopover.styled.ts`

**Path:** `src/components/Lists/EditCardPopover/EditCardPopover.styled.ts`

| Component | Base | Notes |
|-----------|------|-------|
| `EditCardPopoverTrigger` | `styled(Popover.Trigger)` | `position: absolute; top: 8px; right: 8px;` inside the card. Circular button, ~28px, gray background on hover. Opacity/width transition driven by `[data-visible]`. `.attrs` with `data-testid`. |
| `EditCardPopoverOverlay` | `styled.div` | Full-page dark backdrop rendered when the popover is open. `position: fixed; inset: 0; background: rgba(0, 0, 0, 0.5); z-index: 2;` — same opacity/z-index approach as `CardModalOverlay`. Rendered inside a `Popover.Portal` (or just portaled alongside the content) so it sits above the board but below the popover content. |
| `EditCardPopoverContent` | `styled(Popover.Content)` | Reuse the shadow/radius/font from `PopoverOptionsContent`. `width: 304px;` same as other popovers. Must have `z-index: 3` (above the overlay). |
| `EditCardTitleTextarea` | `styled.textarea` | Full width, border, border-radius, font-size matching `EditCardTitleInput` in Card.styled. |
| `EditCardSaveButton` | `styled(Button)` | Primary blue, full width, follows the `Button` from `Page.styled`. |
| `EditCardActionOption` | `styled.button` | Same styles as `ListActionsOption` — padding, hover background, text-align left, full width, flex with gap for icon + label. |
| `CopyLinkIconContainer` | `styled.span` | `display: inline-flex; transition: opacity 150ms;` for the icon cross-fade. |

All styled components get `.attrs<DataAttributes>({ 'data-testid': '...' })`.

### Overlay behavior

Radix `Popover` does not have a built-in `Overlay` primitive (unlike `Dialog`). We render `EditCardPopoverOverlay` manually inside the `Popover.Portal`, as a sibling before `EditCardPopoverContent`. When the popover is open, the overlay covers the full viewport with a dark transparent background. Clicking the overlay closes the popover (Radix's default `onInteractOutside` handles this — the click lands outside the popover content, which triggers `onOpenChange(false)`).

The originating card should appear elevated above the overlay. To achieve this, when the popover is open, set `z-index: 3; position: relative;` on the `ListCardContainer` via a prop or data-attribute (e.g. `data-edit-open`). This makes the card visually "pop" above the backdrop while the rest of the board dims — matching the Trello-style behavior in the screenshots.

---

## 3. Integrate trigger into `CardTitleDetails`

**File:** `src/components/Lists/CardTitleDetails/CardTitleDetails.tsx`

Changes:

1. Import `EditCardPopover`.
2. Add `<EditCardPopover>` as a child of `ListCardContainer`, after `ListCardTitleDetailsContainer`. Pass `cardId={id}`, `listId` (new prop — see §4), `title={title}`, `visible={isHovering || isFocused}`.
3. The popover trigger is `position: absolute` inside the card (the card already has `position: relative`).

### Preventing click-through to card modal

The `CardModalTrigger` wrapping the whole card calls `open` (navigates to card modal) on click. The edit-icon's `onClick` already stops propagation (§1), so clicking the icon won't open the modal. No changes needed to `useCardModalTrigger`.

---

## 4. Thread `listId` into `CardTitleDetails`

**File:** `src/components/Lists/List.tsx`

`CardTitleDetails` currently receives `{ id, title, description, isCompleted }`. Add `listId`:

```tsx
<CardTitleDetails
  id={card.id}
  listId={listId}            // ← new
  description={card.cardDescription}
  isCompleted={card.isCompleted}
  title={card.cardTitle}
/>
```

Update `CardTitleDetailsProps` to include `listId: string`.

This avoids an extra `useGetCard` call inside the popover just to get the `listId`.

---

## 5. Open Card action — passing the navigate function

The `EditCardPopover` needs to open the card modal. Two options:

**Option A (preferred):** Accept an `onOpenCard: () => void` prop. `CardTitleDetails` passes the `open` function from `useCardModalTrigger`. Inside the popover, the "Open card" button calls `onOpenCard()` after closing the popover.

This avoids duplicating the navigate logic and keeps `EditCardPopover` presentation-only.

---

## 6. Move action — reusing `MoveCardFields`

`MoveCardFields` already handles board/list/position selection and the move mutation. It is currently rendered inside `MoveCardMenu` (which is a `Popover.Root`). `MoveCardFields` renders `MoveCardMenuContent` which is a `styled(Popover.Content)`. 

Since our `EditCardPopover` is itself a `Popover.Root`, we have two approaches:

**Approach A — inline the move UI:** When `view === 'move'`, render a simplified version of the move fields directly inside our popover content. Import `BoardSelect`, `ListSelect`, `PositionSelect`, and `useMoveCardSelectOptions` the same way `MoveCardFields` does. This avoids nesting a `Popover.Content` inside a `Popover.Content`.

**Approach B (preferred) — extract the move form:** Factor the form body out of `MoveCardFields` into a `MoveCardForm` component that doesn't render its own `Popover.Content`. Both `MoveCardFields` (in the card modal) and our `EditCardPopover` (in the list view) render `MoveCardForm` inside their own containers. This is a small refactor that keeps the move logic in one place.

---

## 7. File inventory

| Action | File |
|--------|------|
| **Create** | `src/components/Lists/EditCardPopover/EditCardPopover.tsx` |
| **Create** | `src/components/Lists/EditCardPopover/EditCardPopover.styled.ts` |
| **Edit** | `src/components/Lists/CardTitleDetails/CardTitleDetails.tsx` — add `listId` prop, render `EditCardPopover` |
| **Edit** | `src/components/Lists/List.tsx` — pass `listId` to `CardTitleDetails` |
| **Edit** | `src/components/Cards/MoveCardMenu/MoveCardFields.tsx` — extract `MoveCardForm` (Approach B) |
| **Create** | `src/components/Cards/MoveCardMenu/MoveCardForm.tsx` — the extracted form body |

---

## 8. Implementation order

1. Thread `listId` through `List.tsx` → `CardTitleDetails` props.
2. Create `EditCardPopover.styled.ts` with all styled components.
3. Create `EditCardPopover.tsx` with the `'actions'` view only (editable title + Save + Open Card + Archive + Copy Link).
4. Wire `EditCardPopover` into `CardTitleDetails`.
5. Test: hover a card → icon appears → click → popover opens → title editable → Save renames → Open Card navigates → Archive deletes → Copy Link copies and animates icon.
6. Extract `MoveCardForm` from `MoveCardFields`.
7. Add the `'move'` view to `EditCardPopover` using `MoveCardForm`.
8. Test the Move flow end-to-end.

---

## 9. Edge cases / notes

- **Drag interaction:** The popover trigger is inside the `Draggable` wrapper. Since it uses `stopPropagation`, it should not interfere with drag initiation (drag uses `onPointerDown` on the card container, not on the edit button). Verify that clicking the edit icon does not start a drag.
- **Keyboard:** The edit icon should be focusable (`tabIndex={0}` comes from `Popover.Trigger`). When the popover is open, focus traps inside (Radix default). On close, focus returns to the trigger.
- **Mobile:** The edit icon visibility is tied to `isHovering || isFocused`. On touch devices, `onFocus` fires on tap, so the icon will appear. Consider whether we want this on mobile at all — for now, include it (the card focus behavior already works on mobile).
- **Tooltip:** The tooltip ("Edit card") should be disabled when the popover is open to avoid overlap. Pass `disabled={isOpen}` to `<Tooltip>`.
- **Overlay z-index stacking:** The overlay is `z-index: 2`, the popover content is `z-index: 3`, and the originating card gets `z-index: 3; position: relative` while the popover is open (via a `data-edit-open` attribute or a callback prop from `EditCardPopover` to the parent). This ensures the card appears above the backdrop. When the popover closes, the card's z-index resets so it doesn't interfere with drag layering.
