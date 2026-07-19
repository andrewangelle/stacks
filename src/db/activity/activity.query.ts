import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createActivity,
  deleteActivity,
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
  type BoardsPayload,
  findCard,
  getBoardsCache,
  patchCardActivities,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';
import { boardsQueryOptions } from '~/db/boards/boards.query';

export function useGetActivity(data: GetActivityArgs) {
  return useQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findCard(boards, data.cardId)?.activities ?? [];
    },
  });
}

export function useGetActivityFeed(data: GetActivityArgs) {
  return useQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findCard(boards, data.cardId)?.activities.filter(
        (item) => item.type === 'feed',
      );
    },
  });
}

export function useGetComments(data: GetActivityArgs) {
  return useQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findCard(boards, data.cardId)?.activities.filter(
        (item) => item.type === 'comment',
      );
    },
  });
}

export function useGetActivityById(
  data: GetActivityByIdArgs & GetActivityArgs,
) {
  return useQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findCard(boards, data.cardId)?.activities.find(
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
      patchCardActivities(variables.cardId, (activities) => [
        result,
        ...activities,
      ]);
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
      const snapshot = getBoardsCache();

      patchCardActivities(variables.cardId, (activities) =>
        activities.map((item) =>
          item.id === variables.activityId
            ? { ...item, content: variables.content }
            : item,
        ),
      );

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
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
      const snapshot = getBoardsCache();

      patchCardActivities(variables.cardId, (activities) =>
        activities.filter((item) => item.id !== variables.activityId),
      );

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });

  return mutation.mutate;
}
