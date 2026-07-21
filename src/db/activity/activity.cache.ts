import type { InfiniteData } from '@tanstack/react-query';
import type { getActivities } from '~/db/activity/activity.functions';
import { queryClient } from '~/query';
import { activitiesQueryOptions } from './activity.query';

/**
 * The one slice of the workspace that lives outside the `['boards']` tree.
 * Activity is a card's history, so it grows without bound while the rest of the
 * tree stays the size of the current board state; keeping it out is what makes
 * the single boards query safe to load up front. Entries are fetched per card
 * when that card opens and cached under `['activities', cardId]`.
 *
 * That unbounded growth is also why this cache is paginated: the panel pulls
 * ten entries at a time as the virtualized list scrolls, so the cache holds an
 * `InfiniteData` of pages rather than one flat array. Read it through
 * `flattenActivities`; write to it through the patch helpers, which walk every
 * loaded page so an edit lands wherever the entry happens to live.
 *
 * The boards tree still carries each card's comment count, since card fronts
 * render it. Mutations here patch both caches so the count never drifts from
 * the entries — see `patchCardCommentsCount` in boards.cache.ts.
 */

export type ActivitiesPage = Awaited<ReturnType<typeof getActivities>>;
export type ActivityPayload = ActivitiesPage['items'][number];
export type ActivitiesPayload = InfiniteData<ActivitiesPage, string | null>;

export function activitiesQueryKey(cardId: string) {
  return ['activities', cardId] as const;
}

export function flattenActivities(data: ActivitiesPayload | undefined) {
  return data?.pages.flatMap((page) => page.items) ?? [];
}

export function getActivitiesCache(cardId: string) {
  return queryClient.getQueryData<ActivitiesPayload>(
    activitiesQueryKey(cardId),
  );
}

export function invalidateActivitiesCache(cardId: string) {
  return queryClient.invalidateQueries({
    queryKey: activitiesQueryKey(cardId),
  });
}

export function restoreActivitiesCache(
  cardId: string,
  snapshot: ActivitiesPayload | undefined,
) {
  if (snapshot) {
    queryClient.setQueryData<ActivitiesPayload>(
      activitiesQueryKey(cardId),
      snapshot,
    );
  } else {
    invalidateActivitiesCache(cardId);
  }
}

export function patchActivities(
  cardId: string,
  patch: (activities: ActivityPayload[]) => ActivityPayload[],
) {
  queryClient.setQueryData<ActivitiesPayload>(
    activitiesQueryKey(cardId),
    (data) =>
      data && {
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: patch(page.items),
        })),
      },
  );
}

/**
 * Entries are newest-first, so a new one belongs at the head of the first page.
 * That page then holds eleven entries; this is deliberate, since re-chunking
 * would invalidate the cursors the later pages were already fetched with.
 */
export function prependActivity(cardId: string, activity: ActivityPayload) {
  queryClient.setQueryData<ActivitiesPayload>(
    activitiesQueryKey(cardId),
    (data) => {
      const [firstPage, ...restPages] = data?.pages ?? [];

      if (!data || !firstPage) {
        return data;
      }

      return {
        ...data,
        pages: [
          { ...firstPage, items: [activity, ...firstPage.items] },
          ...restPages,
        ],
      };
    },
  );
}

export function findActivity(cardId: string, activityId: string) {
  return flattenActivities(getActivitiesCache(cardId)).find(
    (item) => item.id === activityId,
  );
}

export async function prefetchActivities(cardId: string) {
  await queryClient.prefetchInfiniteQuery(activitiesQueryOptions(cardId));
}
