import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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
  GetActivityByIdArgs,
  UpdateActivityArgs,
} from '~/db/activity/activity.schemas';
import { adjustCardCommentCount } from '~/db/lists/lists.cache';
import type { Activity } from '~/generated/prisma/client';

export type ActivityListItem = Pick<Activity, 'id' | 'type' | 'createdAt'>;

function toActivityListItem(item: Activity): ActivityListItem {
  return item;
}

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
  return useQuery({
    ...activityListQueryOptions(data),
    select(data) {
      return data?.filter((item) => item.type === 'feed');
    },
  });
}

export function activityByIdQueryOptions(
  data: GetActivityByIdArgs & GetActivityArgs,
) {
  return {
    ...activityListQueryOptions(data),
    select(response: Activity[]) {
      return response?.find((item) => item.id === data.activityId);
    },
  };
}

export function useGetActivityById(
  data: GetActivityByIdArgs & GetActivityArgs,
) {
  return useQuery(activityByIdQueryOptions(data));
}

export function useGetComments(data: GetActivityArgs) {
  return useQuery({
    ...activityListQueryOptions(data),
    select(data) {
      return data?.filter((item) => item.type === 'comment');
    },
  });
}

export function useCreateActivity() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: CreateActivityArgs) {
      return createActivity({ data });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<ActivityListItem[]>(
        queryKeys.list(variables.cardId),
        (cache = []) => [toActivityListItem(result), ...cache],
      );
      queryClient.setQueryData(queryKeys.detail(result.id), result);

      if (variables.type === 'comment') {
        adjustCardCommentCount(variables.cardId, 1);
      }
    },
  });

  return mutation.mutate;
}

export function useUpdateActivity() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: UpdateActivityArgs) {
      return updateActivity({
        data,
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<ActivityListItem[]>(
        queryKeys.list(variables.cardId),
        (cache) => {
          if (cache) {
            return cache.map((item) => {
              if (item.id === variables.activityId) {
                return { ...item, content: variables.content };
              }
              return item;
            });
          }
          return cache;
        },
      );

      queryClient.setQueryData<Activity>(
        queryKeys.detail(variables.activityId),
        (cache) => (cache ? { ...cache, content: variables.content } : cache),
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteActivity() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: DeleteActivityArgs) {
      return deleteActivity({ data });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<ActivityListItem[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.filter((item) => item.id !== variables.activityId),
      );

      queryClient.removeQueries({
        queryKey: queryKeys.detail(variables.activityId),
      });

      if (result?.type === 'comment') {
        adjustCardCommentCount(variables.cardId, -1);
      }
    },
  });

  return mutation.mutate;
}
