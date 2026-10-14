# Card display menu: Comments toggle

## Goal

A display menu sits under the card modal with one **Comments** toggle button.

- **Selected** means the comments/activity panel is hidden. **Deselected** means it shows.
- The state lives on the user (`User.commentsVisible`), so it applies to every card on every list and board, and it survives a reload.
- **Desktop only.** On mobile (`useIsMobile()`), the card gets no menu, always shows comments/activity, and behaves exactly as it does today. Mobile normally opens the full-page `variant="page"` card, but the modal card (`/board/$id/card/$cardId`) also renders on mobile: activity links (`LinkToCard`) and direct loads reach it on every device. So every modal-only change below is gated on `!isMobile`, not assumed unreachable.
- While the card modal is open, its display menu slides up and the board page's display menu slides down. When the modal closes, the reverse happens.
- The activity column slides in and out when the toggle changes.

## Decisions taken (confirm or override before implementing)

1. **Selected = `!commentsVisible`.** The column defaults to `true`, so the button starts deselected and the panel starts visible. This follows the requirement as written: "When selected the comments/activity panel should be hidden".
2. **The card menu renders outside `CardModalContent`**, as a sibling of it inside `CardModalOverlay` (see section 5). `CardModalContent`'s `onPointerDownOutside` must ignore pointer-downs inside the menu, so clicking it doesn't close the modal.
3. **The modal gives up bottom space for the menu.** Today `CardModalContent` is `95vh` and centered, which leaves only ~2.5vh below it. A fixed menu at `bottom: 24px` would cover the modal's bottom edge.
4. **The new user data files get their own folder, `src/db/user/`**, like every other domain. `src/db/user.server.ts` moves to `src/db/user/user.server.ts` (`git mv`, so history follows). Its only importer, `src/middleware/auth.ts`, changes to `~/db/user/user.server`.
5. **The user preference gets its own query key, `['user', 'preferences']`.** This does not break the "boards cache is the single source of truth" rule, because that rule is about board/list/card data. A user preference does not belong in the boards tree.

## Known limitations

Because the menu sits outside the modal content, it has two limitations:

- **Keyboard:** Radix keeps Tab focus inside the modal (`FocusScope`), so the Comments button can't be reached with Tab. Mouse clicks still work.
- **Screen readers:** Radix marks everything outside the modal as hidden from screen readers (`hideOthers` sets `aria-hidden`), so they won't announce the menu.

Fixing either would mean moving the menu back inside the modal content.

## 1. Schema

`prisma/schema.prisma`, in `model User`:

```prisma
commentsVisible Boolean @default(true) @map("comments_visible")
```

Only edit `schema.prisma`. **The user runs the migration.** Don't hand-write migration SQL, and don't run `db push` against the e2e DB.

`tests/fixtures/reset.ts` creates the test user with only `id`/`email`, so each test starts with the default `true`. No change is needed there.

## 2. Server and data layer

### `src/db/user/user.server.ts` (moved from `src/db/user.server.ts`, then add)

```ts
export async function getUserPreferencesQuery({ userId }: WithUserId<{}>) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { commentsVisible: true },
  });
  return { commentsVisible: user?.commentsVisible ?? true };
}

export async function setCommentsVisibleQuery({ userId, commentsVisible }: WithUserId<SetCommentsVisibleArgs>) {
  return prisma.user.update({
    where: { id: userId },
    data: { commentsVisible },
    select: { commentsVisible: true },
  });
}
```

Why `findUnique` with a `?? true` fallback: `authMiddleware` (`src/middleware/auth.ts`) calls `next()` **before** it upserts a missing user. On a brand-new user's first request the row may not exist yet. `update` in the setter is safe, because a click can only happen after earlier authed requests have created the row.

### `src/db/user/user.schemas.ts` (new)

```ts
export const SetCommentsVisibleSchema = z.object({ commentsVisible: z.boolean() });
export type SetCommentsVisibleArgs = z.infer<typeof SetCommentsVisibleSchema>;
```

Match how the other `*.schemas.ts` files export their arg types.

### `src/db/user/user.functions.ts` (new)

Use the same shape as `cards.functions.ts`:

- `getUserPreferences`: `createServerFn({ method: 'GET' }).middleware([authMiddleware])`, which calls `getUserPreferencesQuery({ userId: context.uid })`.
- `setCommentsVisible`: `createServerFn({ method: 'POST' }).validator(SetCommentsVisibleSchema).middleware([authMiddleware])`.

### `src/db/user/user.query.ts` (new)

```ts
export const userPreferencesQueryOptions = {
  queryKey: ['user', 'preferences'],
  queryFn: () => getUserPreferences(),
};

/** Mobile always shows comments, so it never fetches the preference. */
export function useCommentsVisible() {
  const isMobile = useIsMobile();
  const { data } = useQuery({
    ...userPreferencesQueryOptions,
    enabled: !isMobile,
    select: (preferences) => preferences.commentsVisible,
  });
  return isMobile || (data ?? true);
}

export function useSetCommentsVisible() {
  // Optimistic update: snapshot with queryClient.getQueryData,
  // setQueryData the new value, roll back to the snapshot in onError.
  // Never invalidate. Same pattern as useSetShowActivityDetails.
}
```

Import `queryClient` from `~/query`. Never pass it as an argument.

This is a plain `useQuery`, not a suspense query. Card.tsx calls it on both variants, and a suspense query can't be skipped on mobile.

### Prefetch in loaders (desktop only)

On desktop the query has to be in the cache before the card renders. Otherwise a user who has hidden comments sees the column flash visible and then slide away. The prefetch only fixes the data: the server-rendered layout comes from CSS, because `useCardColumnWidth` returns `isWideLayout = false` during SSR and the inline `gridTemplateColumns` is never applied there. That is why the collapsed state lives in CSS (section 6). Add `if (!context.isMobile) await context.queryClient.ensureQueryData(userPreferencesQueryOptions)` to:

- `src/routes/board.$id.tsx` (covers `/board/$id/card/$cardId`, which is a child of it)
- `src/routes/card.$cardId.tsx` (desktop renders the board and the modal here)

## 3. Reusable DisplayMenu pieces

`src/components/DisplayMenu/DisplayMenu.styled.ts`. Extract the existing pieces without changing any visuals:

- `displayMenuSelectedItemStyles` (css): the `#e9f2fe` background, `${blue}` color and `#cfe1fd` hover, taken out of `DisplayMenuBoardButton`. `DisplayMenuBoardButton` then becomes `${displayMenuItemStyles} ${displayMenuSelectedItemStyles} cursor: not-allowed;`.
- `displayMenuItemHoverStyles` (css): the `rgba(9, 30, 66, 0.06)` hover, taken out of `SwitchBoardsTrigger` (`SwitchBoards.styled.ts`). `SwitchBoardsTrigger` uses it.
- `displayMenuSelectedLabelStyles` (css): the `::after` underline, taken out of `DisplayMenuBoardLabel`. `DisplayMenuBoardLabel` uses it.
- `DisplayMenuContainer` gets a `$hidden: boolean` prop for the slide (see section 6). Both menus share this one container.

New components in the same file, each with a `data-testid` per repo convention:

- `CardDisplayMenuContainer = styled(DisplayMenuContainer).attrs<DataAttributes>({ 'data-testid': 'CardDisplayMenuContainer' })`. Same styling and **no separator**. It renders inside `CardModalOverlay` (`z-index: 2`), so it already sits above the board. Set `pointer-events: auto` on it explicitly too. Radix gives the overlay `pointerEvents: 'auto'` inline while the modal sets `pointer-events: none` on `body`, and this keeps the menu clickable no matter what Radix does to its ancestors.
- `DisplayMenuToggleButton = styled.button.attrs<DataAttributes>({ 'data-testid': 'DisplayMenuToggleButton', type: 'button' })<{ $selected: boolean }>`. It uses `${displayMenuItemStyles}`, plus `displayMenuSelectedItemStyles` when selected or `displayMenuItemHoverStyles` when not.
- `DisplayMenuToggleLabel` (span, also `.attrs<DataAttributes>({ 'data-testid': 'DisplayMenuToggleLabel' })`) uses `displayMenuSelectedLabelStyles` only when `$selected`. This matches how the board button shows its current state.

## 4. `CardDisplayMenu` component

New file `src/components/DisplayMenu/CardDisplayMenu.tsx`. It is declared at module scope; no nested component declarations.

```tsx
export function CardDisplayMenu({ hidden, menuRef }: { hidden: boolean; menuRef: RefObject<HTMLDivElement | null> }) {
  const commentsVisible = useCommentsVisible();
  const setCommentsVisible = useSetCommentsVisible();
  const selected = !commentsVisible;

  return (
    <CardDisplayMenuContainer ref={menuRef} $isMobile={false} $hidden={hidden}>
      <Tooltip content={selected ? 'Show comments' : 'Hide comments'}>
        <DisplayMenuToggleButton
          $selected={selected}
          aria-pressed={selected}
          onClick={() => setCommentsVisible({ commentsVisible: !commentsVisible })}
        >
          <BiCommentDetail size={16} />
          <DisplayMenuToggleLabel $selected={selected}>Comments</DisplayMenuToggleLabel>
        </DisplayMenuToggleButton>
      </Tooltip>
    </CardDisplayMenuContainer>
  );
}
```

Card.tsx renders it only when `!isMobile` (section 5), so `$isMobile` is always `false`.

The icon is `BiCommentDetail` from `react-icons/bi`, the same one `CardTitleDetailsContentIcons.tsx` uses. `displayMenuItemStyles` already sizes the svg at `flex: 0 0 16px`.

## 5. Card integration (`src/components/Cards/Card.tsx`)

- Read `commentsVisible` with `useCommentsVisible()`. It is always `true` on mobile, so the `variant="page"` card and its `CardPageActivityColumn` behave exactly as today. **Don't change the page branch at all.**
- Read `isMobile` with `useIsMobile()`.
- In the modal branch only, and only when `!isMobile`, render `<CardDisplayMenu hidden={isClosingCard} menuRef={cardDisplayMenuRef} />` **as a sibling after `CardModalContent`**, inside `CardModalOverlay`:

  ```tsx
  <CardModalOverlay>
    <CardModalContent onPointerDownOutside={handlePointerDownOutside} …>
      {cardBody}
    </CardModalContent>
    {!isMobile && <CardDisplayMenu hidden={isClosingCard} menuRef={cardDisplayMenuRef} />}
  </CardModalOverlay>
  ```

  `isClosingCard` already turns true in `handleOpenChange`, so the menu starts sliding down while the close navigation runs. The modal branch also renders on mobile (`/board/$id/card/$cardId` reached from `LinkToCard` or a direct load), which is why the menu is gated on `!isMobile`. There the modal shows comments always, since `useCommentsVisible()` returns `true` on mobile.

### Keeping the modal open when the menu is clicked

Radix treats any pointer-down outside `CardModalContent` as a dismiss (`onPointerDownOutside`), and the menu is outside it. Combine the menu check with the existing dev-tools guard in one module-scope handler factory or inline function. Don't declare a nested component:

```tsx
const cardDisplayMenuRef = useRef<HTMLDivElement>(null);

function handlePointerDownOutside(event: PointerDownOutsideEvent) {
  if (cardDisplayMenuRef.current?.contains(event.target as Node)) {
    event.preventDefault();
    return;
  }
  preventCloseOnDevToolsEvent(event);
}
```

Use a ref rather than a `closest('[data-testid=…]')` selector, so the guard doesn't depend on a testid. `CardDisplayMenuContainer` forwards the ref, because styled-components passes `ref` through.

No other outside handler needs a guard:

- `onFocusOutside` is already `preventDefault`ed by Radix's modal content.
- `onInteractOutside` only fires for pointer-down and focus-outside.
- Escape still closes the modal, as it does today.

See **Known limitations** at the top for what placing the menu outside the content costs.

### Activity column and resize handle

- **Keep `ActivityPanel` mounted when hidden.** This keeps a half-typed comment and the Suspense subtree intact (see the memory note on Suspense boundary teardown). Hiding is pure CSS. Don't conditionally render.
- **Keep `CardColumnResize` mounted in the wide layout too.** The grid needs three tracks on both sides of the transition, or `grid-template-columns` won't interpolate and the activity column would drop into the 8px track. Hide the handle with `visibility` and `pointer-events: none` when comments are hidden.

### Modal space for the menu (`Card.styled.ts`)

All of these changes are modal-only **and desktop-only**. `CardPageContent` is untouched. The modal also renders on mobile, which has no menu, so it must keep today's sizes. `CardModalContent` and `CardModalOverlay` take a `$reserveMenuSpace` prop, passed as `!isMobile` from Card.tsx; when false, the current CSS applies unchanged.

- Export a `cardDisplayMenuReservedSpace` constant from `DisplayMenu.styled.ts`: menu height (6 + 36 + 6 = 48px) + `bottom: 24px` + a 12px gap = `84px`.
- `CardModalContent` (when `$reserveMenuSpace`): `height: calc(95vh - 84px)`. Inside `@media (max-width: 850px)`: `max-height: calc(99vh - 84px)`.
- `CardModalOverlay` (when `$reserveMenuSpace`): `padding-bottom: 84px`, so the centered modal sits above the menu. The overlay is the scroll container, so the padding also keeps scrolled content clear of the menu.

## 6. Animations

All of these use 150ms ease-out, the repo's standard (`Checklists.styled.ts`, `CardDescription.styled.ts`).

### Display menus slide up/down (`DisplayMenuContainer`)

```css
transform: translateX(-50%) translateY(${$hidden ? 'calc(100% + 24px)' : '0'});
visibility: ${$hidden ? 'hidden' : 'visible'};
transition: transform 150ms ease-out, visibility 150ms ease-out;
```

`visibility` flips discretely at the end of the transition, so the menu stays painted while it slides away and then leaves the a11y tree and tab order. This is the same trick as `CardDescriptionBodyInner`.

**Card menu on open.** The menu mounts already visible, and a transition can't run on mount. Add a mount keyframe to `CardDisplayMenuContainer` only:
`animation: ${displayMenuSlideUpFrames} 150ms ease-out` (from `translateX(-50%) translateY(calc(100% + 24px))` to `translateX(-50%) translateY(0)`). Put the keyframes in `src/styles/animations.ts` next to `fadeIn`.

**Board menu (`DisplayMenu.tsx`).** `hidden` = `!isMobile` and the `/board/$id/card/$cardId` route is in `useMatches()`. The `!isMobile` gate matters because the modal route renders on mobile too (no card menu there), and the board menu must stay visible. It only renders in `board.$id.tsx`, so opening a card from the board makes it slide down and closing makes it slide up, using the transition above. On a direct load of a card URL, SSR renders it hidden with no transition. That's correct: nothing should animate on first paint.

**Edge case: closing from `/card/$cardId` on desktop.** That route renders no board `DisplayMenu`, so the close navigation *mounts* a fresh one at `/board/$id`. A fresh mount gets no transition. Fix: start the board menu `hidden` only when `!isMobile` and the mount comes from a client-side navigation whose previous route was `/card/$cardId` (e.g. the router's `resolvedLocation` pathname at mount starts with `/card/`). Then flip it to visible in a `useEffect` after mount, so the transition runs. Don't gate on `search.from` alone: `from=card-…` stays in the URL after any desktop modal close, so a reload of that URL would render the menu hidden on the server and slide it in after hydration.

- A normal board load, and any reload or direct load (even one with `?from=card-…`), has no previous route, so it renders visible straight away. That keeps today's no-animation first paint and avoids hiding the menu until hydration. Confirm in the running app that `resolvedLocation` is empty on a reload; if it isn't, use a client-only flag set by the close navigation instead.
- On mobile, closing the page card also lands on `/board/$id?from=card-…`. The `!isMobile` gate keeps mobile's menu appearing exactly as it does today.
- The `/board/$id/card/$cardId` route match can happen on mobile (see Goal), so the route-based hide is gated explicitly on `!isMobile` above.

### Activity column slide in/out

**Wide layout (≥851px).** `CardModalBody` already gets `gridTemplateColumns` inline (`minmax(0, 1fr) 8px ${columnWidth}px`), but only when `isWideLayout` is true, which is never the case during SSR. The CSS default (`Card.styled.ts:108`) is `minmax(0, 1fr) 8px minmax(200px, 280px)`.

- Put the collapsed state in CSS, not the inline style. `CardModalBody` gets a `$commentsVisible` prop that sets `grid-template-columns: minmax(0, 1fr) 0px 0px` inside `@media (min-width: 851px)` when false. Keep the inline `gridTemplateColumns` only for the visible, resizable width, and don't set it when comments are hidden. The server-rendered card then renders collapsed on a direct load or reload. Removing the inline style on toggle changes the computed value, so the transition below still runs.
- Add `transition: grid-template-columns 150ms ease-out` to `CardModalBody`, **but turn it off while the user drags the resize handle**. Otherwise every pointermove becomes a 150ms tween and the column lags behind the cursor. Move `isResizing` into `useCardColumnWidth` as state, set it in `initializePointer`/`releasePointer` in `CardColumnResize.tsx`, and pass `$isResizing` to `CardModalBody`.
- `CardActivityColumn` gets `$visible`: `overflow: hidden` while collapsed, plus `visibility` with a matching 150ms transition. The panel content keeps its width during the slide-out instead of reflowing narrower.

**Narrow desktop window (≤850px, flex column).** The modal still renders at this width on desktop, and the column stacks vertically. Wrap the activity column's contents in the same `0fr`↔`1fr` `grid-template-rows` pattern as `CardDescriptionBody`/`CardDescriptionBodyInner`. Don't copy those components; give the new ones their own testids (`CardActivityCollapse`, `CardActivityCollapseInner`). Nothing measures a height, and the contents stay mounted.

## 7. e2e coverage (ship with the feature)

Add to `tests/card.test.ts`, plus helpers in `tests/helpers/CardPage.ts`. Follow `.claude/CLAUDE.md`: **drive the transitions with `getAnimations()`, `pause()` and `currentTime`. Never sample frames.**

The card tests load `/board/${board.id}/card/${card.id}` directly and have no mobile skip, so they also run in the `Mobile Chrome` and `Mobile Safari` projects, where that URL renders the modal. Tests 1–4, 6 and 7 are desktop-only: skip them in the mobile projects (new tests only; don't change existing ones).

1. **Menu renders.** Open a card. `CardDisplayMenuContainer` is visible and contains one `DisplayMenuToggleButton` with text "Comments" and `aria-pressed="false"`. There is no `DisplayMenuSeperator` inside it. `CardActivityColumn` is visible.
2. **Toggle hides comments.** Click it. `aria-pressed="true"` and `CardActivityColumn` is hidden (visibility). Click again and it's visible again.
3. **Persisted and global.** Hide comments, then reload: still hidden, with `visibility: hidden` **and** `CardActivityColumn` width of about 0 (this catches the SSR layout, which `visibility` alone doesn't). Open a card in another list, and a card on a second seeded board: hidden on both.
4. **Clicking the menu doesn't close the modal.** After clicking the toggle (both directions), `CardModalContent` is still visible and the URL is unchanged: record `urlBefore` before the click and assert equality afterward, as `tests/card.test.ts:159-168` does. (Don't hardcode `/board/$id/card/$cardId`: a client-side open is masked as `/card/<first 8 chars of id>` by `routeMasks.ts`.) Clicking the overlay outside both the content and the menu still closes the modal (a regression guard for the guard).
5. **Mobile is unchanged.** Run this in the `Mobile Safari`/`Mobile Chrome` projects only (skip elsewhere). Set the user's `commentsVisible` to `false` via the seed helper below, then:
   - Open the page variant, either by loading `/card/$cardId` or by clicking the card from the board: no `CardDisplayMenuContainer`, and `CardActivityColumn` is visible.
   - Load `/board/$id/card/$cardId` directly (the modal on mobile): no `CardDisplayMenuContainer`, `CardActivityColumn` is visible, and the board `DisplayMenuContainer` is not hidden by the route match.

   Seed over HTTP like the rest of the suite: add a fixture in `tests/fixtures/` (the only place that calls Prisma directly, e.g. `prisma.user.update` setting `commentsVisible` for the test user), a `/__test/...` endpoint in `tests/plugins/resetDB.ts` that calls it, and a helper in `tests/helpers/seed.ts` that posts to it with `request.post`. The desktop toggle can't be used to set the preference here, because mobile has no menu. Don't change what an existing test does.
6. **Board menu hands off.** On `/board/$id`, `DisplayMenuContainer` is visible. Open a card: it's hidden and the card menu is visible. Close with Escape: the board menu is visible and the card menu is gone. Repeat the close from a `/card/$cardId` direct load on desktop (the mount edge case). Also reload `/board/$id?from=card-…` and assert the board menu is visible on first paint with no running transform animation.
7. **Animations.** Add a generic `driveTransition(testId, property, read)` helper, generalized from `driveSlide`: find the animation by `transitionProperty` (or `animationName` for the mount keyframe), pause it, step `currentTime`, read a layout value, `finish()`. Assert the value is strictly between the endpoints and moving monotonically, like `expectSlide`:
   - Board menu `transform` on card open/close: read `getBoundingClientRect().top`.
   - Activity column `grid-template-columns` on `CardModalBody` when toggling: read `CardActivityColumn` width.
   - Narrow layout: `grid-template-rows` on `CardActivityCollapse`. Read the inner height at a ≤850px viewport.

If a failure names a browser, rerun only `--project=<that browser>`.

## 8. Verification

- `pnpm test:types`, then lint (no `--unsafe` and no `lint:fix`).
- Render-check in the running app:
  - The card menu sits under the modal without overlapping it, at wide and ≤850px desktop widths.
  - Clicking the menu leaves the modal open.
  - The mobile page card and the mobile modal card (`/board/$id/card/$cardId`) look and behave as they do today: no card menu, original modal sizing, board menu still visible.
  - The selected state matches the board button's look.
  - Both menus slide.
  - The column slides, and the resize handle still drags smoothly with no lag.
- SSR check from `.claude/CLAUDE.md`: `curl -sL http://localhost:3000/board/<id> | grep -o '<style[^>]*>' | head` still shows a `<style>` in `<head>`.
- Run the e2e suite. Don't run it in the background while a dev server holds the ports.

## Files touched

- `prisma/schema.prisma`
- `src/db/user.server.ts` → `src/db/user/user.server.ts` (moved, plus the new queries)
- `src/db/user/user.schemas.ts`, `src/db/user/user.functions.ts`, `src/db/user/user.query.ts` (new)
- `src/middleware/auth.ts` (import path only)
- `src/routes/board.$id.tsx`, `src/routes/card.$cardId.tsx`
- `src/components/DisplayMenu/DisplayMenu.styled.ts`, `DisplayMenu.tsx`, `CardDisplayMenu.tsx` (new), `SwitchBoards/SwitchBoards.styled.ts`
- `src/components/Cards/Card.tsx`, `Card.styled.ts`, `CardColumnResize.tsx`
- `src/hooks/useCardColumnWidth.ts`
- `src/styles/animations.ts`
- `tests/card.test.ts`, `tests/helpers/CardPage.ts`
- `tests/fixtures/` (new user-preference fixture), `tests/plugins/resetDB.ts` (new `/__test/...` endpoint), `tests/helpers/seed.ts` (new seed helper)
