---
name: add-get-by-id-query
description: >-
  Add a get-by-id read query across the stacks data layer (Zod schema, Prisma
  server query, TanStack Start server function, React Query hook, and test mock).
  Use when the user asks to add get X by id, fetch a single record, or wire up a
  detail query for cards, lists, checklists, activity, or similar entities.
---

# Add a Get-By-Id Query

Add a single-record read endpoint by touching five layers in order. Copy an existing entity that already has a list query and a by-id query (e.g. `activity`, `cards`, `checklists`).

**Name mapping** — derive every name from the entity. For `activity`: folder `src/db/activity/`, Prisma model `prisma.activity` (singular), and in-memory store collection `getStore().activities` (plural). Match the casing/pluralization the existing entity already uses.

## Checklist

```
- [ ] 1. Schema — `src/db/<entity>/<entity>.schemas.ts`
- [ ] 2. Server query — `src/db/<entity>/<entity>.server.ts`
- [ ] 3. Server function — `src/db/<entity>/<entity>.functions.ts`
- [ ] 4. React Query hook — `src/query/<entity>.ts`
- [ ] 5. Test mock — `tests/mocks/db/<entity>.ts`
- [ ] 6. Verify — `pnpm test:types`
```

## 1. Schema

Add a Zod schema and exported type. Name the id field after the entity:

| Entity | Schema | Id field |
|--------|--------|----------|
| card | `GetCardByIdSchema` | `cardId` |
| checklist | `GetChecklistByIdSchema` | `checklistId` |
| activity | `GetActivityByIdSchema` | `activityId` |

```typescript
export const GetActivityByIdSchema = z.object({
  activityId: z.string(),
});

export type GetActivityByIdArgs = z.infer<typeof GetActivityByIdSchema>;
```

## 2. Server query

In `<entity>.server.ts`, add `<entity>ByIdQuery` using `prisma.<model>.findFirst`.

**Auth:** match the existing list query for the same entity so list and detail use the same ownership rules.

- **Board-owned records** (activity on a card): filter through nested relations.
  ```typescript
  card: { list: { board: { userId: data.userId } } }
  ```
- **User-owned records** (checklist, checklist item): filter on `userId: data.userId`.

**Board-owned example** (`activity` — ownership is reached through relations):

```typescript
export function getActivityByIdQuery(data: WithUserId<GetActivityByIdArgs>) {
  return prisma.activity.findFirst({
    where: {
      id: data.activityId,
      card: { list: { board: { userId: data.userId } } },
    },
  });
}
```

**User-owned example** (`checklist` — the row has its own `userId` column):

```typescript
export function getChecklistByIdQuery(data: WithUserId<GetChecklistByIdArgs>) {
  return prisma.checklist.findFirst({
    where: {
      id: data.checklistId,
      userId: data.userId,
    },
  });
}
```

Return `null` when not found (`findFirst`), not an error.

## 3. Server function

In `<entity>.functions.ts`, export a GET `createServerFn` wired through `authMiddleware`:

```typescript
export const getActivityById = createServerFn({ method: 'GET' })
  .validator(GetActivityByIdSchema)
  .middleware([authMiddleware])
  .handler(async ({ data, context }) =>
    getActivityByIdQuery({ ...data, userId: context.uid }),
  );
```

## 4. React Query hook

In `src/query/<entity>.ts`:

1. Add a `detail` query key alongside any existing `list` key. The `detail` key is keyed by the record's own id; the `list` key may be keyed by a parent id (activity's list is keyed by `cardId`) — keep whatever the existing list key uses.
2. Export `<entity>ByIdQueryOptions` for prefetching.
3. Export `useGet<Entity>ById` wrapping `useQuery`.

```typescript
const queryKeys = {
  list: (cardId: string) => ['activity', cardId] as const,
  detail: (activityId: string) => ['activity', 'detail', activityId] as const,
};

export function activityByIdQueryOptions(data: GetActivityByIdArgs) {
  return {
    queryKey: queryKeys.detail(data.activityId),
    enabled: !!data.activityId,
    queryFn() {
      return getActivityById({ data });
    },
  };
}

export function useGetActivityById(data: GetActivityByIdArgs) {
  return useQuery(activityByIdQueryOptions(data));
}
```

**Mutation cache updates:** if create/update/delete mutations exist for the list query, also update or invalidate the `detail` key when a single record changes.

## 5. Test mock

Add `findFirst` to `tests/mocks/db/<entity>.ts` in the matching model object. Mirror the Prisma `where` shape from step 2 and reuse the same ownership logic the `findMany` mock already uses for that entity.

**Board-owned example** (`activity` — walk relations and reuse `cardBelongsToUser`):

```typescript
async findFirst(args: {
  where: {
    id: string;
    card: { list: { board: { userId: string } } };
  };
}) {
  const userId = args.where.card.list.board.userId;
  return (
    getStore().activities.find((activity) => {
      const cardInStore = getStore().cards.find(
        (card) => card.id === activity.cardId,
      );
      return (
        activity.id === args.where.id &&
        cardInStore &&
        cardBelongsToUser(cardInStore, userId)
      );
    }) ?? null
  );
}
```

**User-owned example** (`checklist` — match directly on `userId`):

```typescript
async findFirst(args: {
  where: { id: string; userId?: string };
}) {
  return (
    getStore().checklists.find(
      (checklist) =>
        checklist.id === args.where.id &&
        (!args.where.userId || checklist.userId === args.where.userId),
    ) ?? null
  );
}
```

## Reference files

| Layer | Example |
|-------|---------|
| Schema | `src/db/activity/activity.schemas.ts` |
| Server query | `src/db/activity/activity.server.ts` |
| Server function | `src/db/activity/activity.functions.ts` |
| React Query | `src/query/activity.ts` |
| Test mock | `tests/mocks/db/activity.ts` |

Other good references: `cards`, `checklists`, `checklistItems`, `lists`, `boards`.

## Verify

```bash
pnpm test:types
```

Only add tests when the user asks or when mutation cache behavior is non-trivial.
