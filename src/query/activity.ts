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
import type { Activity } from '~/generated/prisma/client';
import { queryClient } from '~/query/queryClient';

const queryKeys = {
  list: (cardId: string) => ['activity', cardId] as const,
};

export function useGetActivity(data: GetActivityArgs) {
  return useQuery({
    queryKey: queryKeys.list(data.cardId),
    queryFn() {
      return getActivity({
        data,
      });
    },
  });
}

export function useCreateActivity() {
  const mutation = useMutation({
    mutationFn(data: CreateActivityArgs) {
      return createActivity({ data });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<Activity[]>(
        queryKeys.list(variables.cardId),
        (cache = []) => [...cache, result],
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateActivity() {
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
        queryKeys.list(variables.cardId),
        (cache = []) => updateActivityInCache(cache, variables),
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteActivity() {
  const mutation = useMutation({
    mutationFn(data: DeleteActivityArgs) {
      return deleteActivity({ data });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Activity[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.filter((item) => item.id !== variables.activityId),
      );
    },
  });

  return mutation.mutate;
}
