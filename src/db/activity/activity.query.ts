import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  type ActivitiesPayload,
  activitiesQueryKey,
  findActivity,
  getActivitiesCache,
  patchActivities,
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

export function activitiesQueryOptions(cardId: string) {
  return {
    queryKey: activitiesQueryKey(cardId),
    queryFn() {
      return getActivities({ data: { cardId } });
    },
    enabled: cardId !== '',
  };
}

export function useGetActivity(data: GetActivityArgs) {
  return useSuspenseQuery(activitiesQueryOptions(data.cardId));
}

export function useGetActivityFeed(data: GetActivityArgs) {
  return useQuery({
    ...activitiesQueryOptions(data.cardId),
    select(activities: ActivitiesPayload) {
      return activities.filter((item) => item.type === 'feed');
    },
  });
}

export function useGetComments(data: GetActivityArgs) {
  return useQuery({
    ...activitiesQueryOptions(data.cardId),
    select(activities: ActivitiesPayload) {
      return activities.filter((item) => item.type === 'comment');
    },
  });
}

export function useGetActivityById(
  data: GetActivityByIdArgs & GetActivityArgs,
) {
  return useQuery({
    ...activitiesQueryOptions(data.cardId),
    select(activities: ActivitiesPayload) {
      return activities.find((item) => item.id === data.activityId);
    },
  });
}

export function useCreateActivity() {
  const mutation = useMutation({
    mutationFn(data: CreateActivityArgs) {
      return createActivity({ data });
    },

    onSuccess(result, variables) {
      patchActivities(variables.cardId, (activities) => [
        result,
        ...activities,
      ]);

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
