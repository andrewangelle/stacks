import type { getActivities } from '~/db/activity/activity.functions';
import { queryClient } from '~/query';

/**
 * The one slice of the workspace that lives outside the `['boards']` tree.
 * Activity is a card's history, so it grows without bound while the rest of the
 * tree stays the size of the current board state; keeping it out is what makes
 * the single boards query safe to load up front. Entries are fetched per card
 * when that card opens and cached under `['activities', cardId]`.
 *
 * The boards tree still carries each card's comment count, since card fronts
 * render it. Mutations here patch both caches so the count never drifts from
 * the entries — see `patchCardCommentsCount` in boards.cache.ts.
 */

export type ActivitiesPayload = Awaited<ReturnType<typeof getActivities>>;
export type ActivityPayload = ActivitiesPayload[number];

export function activitiesQueryKey(cardId: string) {
  return ['activities', cardId] as const;
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
    (activities) => (activities ? patch(activities) : activities),
  );
}

export function findActivity(cardId: string, activityId: string) {
  return getActivitiesCache(cardId)?.find((item) => item.id === activityId);
}
