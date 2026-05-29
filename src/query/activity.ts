import type { Activity } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createActivity,
  deleteActivity,
  getActivity,
  updateActivity,
} from '~/db/activity/activity.functions';
import type {
  CreateActivityArgs,
  DeleteActivityArgs,
  GetActivityArgs,
  UpdateActivityArgs,
} from '~/db/activity/activity.schemas';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';

export function useGetActivityQuery(data: GetActivityArgs) {
  return useQuery({
    queryKey: queryKeys.activity(data.cardId),
    queryFn() {
      return getActivity({
        data,
      });
    },
  });
}

export function useCreateActivityMutation() {
  const mutation = useMutation({
    mutationFn(args: CreateActivityArgs) {
      return createActivity({ data: args });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) => [...cache, result],
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateActivityMutation() {
  function updateActivityInCache(
    cache: Activity[],
    variables: UpdateActivityArgs,
  ) {
    return cache.map((item) => {
      if (item.id === variables.activityId) {
        return { ...item, content: variables.content };
      }
      return item;
    });
  }

  const mutation = useMutation({
    mutationFn(data: UpdateActivityArgs) {
      return updateActivity({
        data,
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) => updateActivityInCache(cache, variables),
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteActivityMutation() {
  const mutation = useMutation({
    mutationFn(data: DeleteActivityArgs) {
      return deleteActivity({ data });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) =>
          cache.filter((item) => item.id !== variables.activityId),
      );
    },
  });

  return mutation.mutate;
}
