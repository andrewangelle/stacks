import { useMutation, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
  createActivity,
  deleteActivity,
  getActivity,
  getActivityById,
  updateActivity,
} from '~/db/activity/activity.functions';
import type {
  CreateActivityArgs,
  DeleteActivityArgs,
  GetActivityArgs,
  GetActivityByIdArgs,
  UpdateActivityArgs,
} from '~/db/activity/activity.schemas';
import type { Activity } from '~/generated/prisma/client';
import { queryClient } from '~/query/queryClient';

const queryKeys = {
  list: (cardId: string) => ['activity', cardId] as const,
  detail: (activityId: string) => ['activity', 'detail', activityId] as const,
};

export function activityListQueryOptions(data: GetActivityArgs) {
  return {
    queryKey: queryKeys.list(data.cardId),
    enabled: !!data.cardId,
    queryFn() {
      return getActivity({ data });
    },
  };
}

export function useGetActivity(data: GetActivityArgs) {
  return useQuery(activityListQueryOptions(data));
}

export function useGetActivityFeed(data: GetActivityArgs) {
  const queryOptions = useMemo(() => activityListQueryOptions(data), [data]);
  return useQuery({
    ...queryOptions,
    select(data) {
      return data?.filter((item) => item.type === 'feed');
    },
  });
}

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

export function useGetComments(data: GetActivityArgs) {
  const queryOptions = useMemo(() => activityListQueryOptions(data), [data]);
  return useQuery({
    ...queryOptions,
    select(data) {
      return data?.filter((item) => item.type === 'comment');
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
