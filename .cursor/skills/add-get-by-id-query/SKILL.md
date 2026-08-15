---
name: add-get-by-id-query
description: >-
  Add a get-by-id read to the stacks data layer. In this codebase that is a
  selector over an already-cached tree, not a new server round-trip. Use when the
  user asks to add get X by id, fetch a single record, or wire up a detail query
  for cards, lists, checklists, activity, or similar entities.
---

# Add a Get-By-Id Query

**A by-id read is a `select` over a cache that is already loaded.** It is not a
new endpoint. `src/db/boards/boards.cache.ts` holds the user's entire workspace
under `['boards']` — boards, lists, cards, checklists, items — fetched once by
the route loader. Every detail hook narrows that tree with a `find` helper.
Adding a server function for a record already in the tree means a second copy of
that record that can drift from it.

Card activity is the one exception: it grows with a card's history rather than
its current state, so it lives in its own paginated cache under
`['activities', cardId]` (see `src/db/activity/activity.cache.ts`). By-id reads
there still select out of that cache rather than fetching the record on its own.

## Checklist

```
- [ ] 1. Find helper — `src/db/boards/boards.cache.ts` (skip if one exists)
- [ ] 2. Query options + hook — `src/db/<entity>/<entity>.query.ts`
- [ ] 3. Verify — `pnpm test:types`
```

## 1. Find helper

`boards.cache.ts` already exports `findBoard`, `findList`, `findCard`, and
`findChecklist`. Add one only for a level that has none, and walk the tree the
same way the neighbors do:

```typescript
export function findChecklistItem(boards: BoardsPayload, itemId: string) {
  for (const board of boards) {
    for (const list of board.lists) {
      for (const card of list.cards) {
        for (const checklist of card.checklists) {
          const item = checklist.items.find(
            (candidate) => candidate.id === itemId,
          );

          if (item) {
            return item;
          }
        }
      }
    }
  }

  return undefined;
}
```

Board ids in route params may be the 8-char masked prefix from a shared URL, so
board lookups go through `boardIdMatches`, not `===`.

## 2. Query options and hook

In `src/db/<entity>/<entity>.query.ts`, spread `boardsQueryOptions` and add a
`select`. Export the options separately so a route loader can prefetch with the
same shape, then wrap them in `useSuspenseQuery`:

```typescript
export function cardByIdQueryOptions(cardId: string) {
  return {
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findCard(boards, cardId);
    },
  };
}

export function useGetCardById(args: { id: string }) {
  return useSuspenseQuery(cardByIdQueryOptions(args.id));
}
```

There is no new query key, so **there is no cache to invalidate**. Mutations
patch the tree through the `patch*` helpers in `boards.cache.ts` and every
selector over it re-derives; `setQueryData`'s structural sharing keeps untouched
branches referentially stable. Never blanket-invalidate `['boards']` to refresh
a detail view.

Reads over the activity cache follow the same shape against
`activitiesQueryOptions(cardId)` — see `useGetActivityById` in
`src/db/activity/activity.query.ts`, which searches the flattened pages.

## When a server function really is needed

Only when the answer is not in a loaded cache. The live examples are both route
concerns rather than detail views:

- `getBoardIdByCardId` (`src/db/cards/cards.server.ts`) resolves a masked 8-char
  card id to the full id and its board before the tree exists.
- `getBoardColor` (`src/db/boards/boards.server.ts`) paints the shell for a
  board the loader has not fetched yet.

If you do need one, the layers are Zod schema → `<entity>.server.ts` query →
`<entity>.functions.ts` server function:

```typescript
// <entity>.schemas.ts — name the id field after the entity
export const GetActivityByIdSchema = z.object({
  activityId: z.string(),
});

export type GetActivityByIdArgs = z.infer<typeof GetActivityByIdSchema>;
```

```typescript
// <entity>.server.ts — match the ownership filter the entity's list query uses.
// Board-owned records reach the user through relations; user-owned records
// (checklist, checklist item) have their own `userId` column.
export function getActivityByIdQuery(data: WithUserId<GetActivityByIdArgs>) {
  return prisma.activity.findFirst({
    where: {
      id: data.activityId,
      card: { list: { board: { userId: data.userId } } },
    },
  });
}
```

```typescript
// <entity>.functions.ts — always through authMiddleware
export const getActivityById = createServerFn({ method: 'GET' })
  .validator(GetActivityByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getActivityByIdQuery({ ...data, userId: context.uid }),
  );
```

Return `null` when not found (`findFirst`), not an error.

## Reference files

| Layer | Example |
|-------|---------|
| Cache + find helpers | `src/db/boards/boards.cache.ts` |
| Select-based by-id hook | `src/db/cards/cards.query.ts`, `src/db/checklists/checklists.query.ts` |
| By-id over the activity cache | `src/db/activity/activity.query.ts` |
| Schema | `src/db/activity/activity.schemas.ts` |
| Server query | `src/db/cards/cards.server.ts` (`getBoardIdByCardIdQuery`) |
| Server function | `src/db/cards/cards.functions.ts` |

## Verify

```bash
pnpm test:types
```

There are no database mocks to extend: the e2e suite runs against a real
Postgres (see `tests/README.md`). Only add tests when the user asks or when
mutation cache behavior is non-trivial.
