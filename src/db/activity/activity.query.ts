import {
  useInfiniteQuery,
  useMutation,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import {
  type ActivitiesPage,
  type ActivitiesPayload,
  activitiesQueryKey,
  findActivity,
  flattenActivities,
  getActivitiesCache,
  patchActivities,
  prependActivity,
  restoreActivitiesCache,
} from '~/db/activity/activity.cache';
import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
} from '~/db/activity/activity.functions';
import type {
  CreateActivityArgs,
  DeleteActivityArgs,
  GetActivityArgs,
  GetActivityByIdArgs,
  UpdateActivityArgs,
} from '~/db/activity/activity.schemas';
import {
  getBoardsCache,
  patchCardCommentsCount,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';

/**
 * One paginated cache entry per card backs every read below. The type filters
 * are applied to the pages already loaded rather than pushed into the query,
 * so a card keeps a single cursor to advance and a single cache to patch —
 * scrolling the panel is what deepens the comments view too.
 */
export function activitiesQueryOptions(cardId: string) {
  return {
    queryKey: activitiesQueryKey(cardId),
    queryFn({ pageParam }: { pageParam: string | null }) {
      return getActivities({ data: { cardId, cursor: pageParam } });
    },
    initialPageParam: null as string | null,
    getNextPageParam(lastPage: ActivitiesPage) {
      return lastPage.nextCursor;
    },
    enabled: cardId !== '',
  };
}

export function useGetActivity(data: GetActivityArgs) {
  return useSuspenseInfiniteQuery({
    ...activitiesQueryOptions(data.cardId),
    select: flattenActivities,
  });
}

export function useGetActivityFeed(data: GetActivityArgs) {
  return useInfiniteQuery({
    ...activitiesQueryOptions(data.cardId),
    select(activities: ActivitiesPayload) {
      return flattenActivities(activities).filter(
        (item) => item.type === 'feed',
      );
    },
  });
}

export function useGetComments(data: GetActivityArgs) {
  return useInfiniteQuery({
    ...activitiesQueryOptions(data.cardId),
    select(activities: ActivitiesPayload) {
      return flattenActivities(activities).filter(
        (item) => item.type === 'comment',
      );
    },
  });
}

export function useGetActivityById(
  data: GetActivityByIdArgs & GetActivityArgs,
) {
  return useInfiniteQuery({
    ...activitiesQueryOptions(data.cardId),
    select(activities: ActivitiesPayload) {
      return flattenActivities(activities).find(
        (item) => item.id === data.activityId,
      );
    },
  });
}

export function useCreateActivity() {
  const mutation = useMutation({
    mutationFn(data: CreateActivityArgs) {
      return createActivity({ data });
    },

    onSuccess(result, variables) {
      prependActivity(variables.cardId, result);

      if (result.type === 'comment') {
        patchCardCommentsCount(variables.cardId, 1);
      }
    },
  });

  return mutation.mutate;
}

export function useUpdateActivity() {
  const mutation = useMutation({
    mutationFn(data: UpdateActivityArgs) {
      return updateActivity({
        data,
      });
    },

    onMutate(variables) {
      const snapshot = getActivitiesCache(variables.cardId);

      patchActivities(variables.cardId, (activities) =>
        activities.map((item) =>
          item.id === variables.activityId
            ? { ...item, content: variables.content }
            : item,
        ),
      );

      return { snapshot };
    },

    onError(_error, variables, context) {
      restoreActivitiesCache(variables.cardId, context?.snapshot);
    },
  });

  return mutation.mutate;
}

export function useDeleteActivity() {
  const mutation = useMutation({
    mutationFn(data: DeleteActivityArgs) {
      return deleteActivity({ data });
    },

    onMutate(variables) {
      const snapshot = getActivitiesCache(variables.cardId);
      const boardsSnapshot = getBoardsCache();
      const deleted = findActivity(variables.cardId, variables.activityId);

      patchActivities(variables.cardId, (activities) =>
        activities.filter((item) => item.id !== variables.activityId),
      );

      if (deleted?.type === 'comment') {
        patchCardCommentsCount(variables.cardId, -1);
      }

      return { snapshot, boardsSnapshot };
    },

    onError(_error, variables, context) {
      restoreActivitiesCache(variables.cardId, context?.snapshot);
      restoreBoardsCache(context?.boardsSnapshot);
    },
  });

  return mutation.mutate;
}
