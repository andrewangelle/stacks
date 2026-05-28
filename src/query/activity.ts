import type { Activity } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createActivity,
  deleteActivity,
  getActivity,
  updateActivity,
} from '~/db/activity/activity.functions';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';

export type ActivityArgs = { cardId: string };
export type CreateActivityArgs = Omit<
  Activity,
  'createdAt' | 'updatedAt' | 'id' | 'userId'
>;
export type UpdateActivityArgs = Pick<Activity, 'id' | 'cardId' | 'content'>;
export type DeleteActivityArgs = Pick<Activity, 'id' | 'cardId'>;

export function useGetActivityQuery(args: ActivityArgs) {
  return useQuery({
    queryKey: queryKeys.activity(args.cardId),
    queryFn() {
      return getActivity({
        data: { cardId: args.cardId },
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
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateActivityMutation() {
  const mutation = useMutation({
    mutationFn(args: UpdateActivityArgs) {
      return updateActivity({
        data: {
          activityId: args.id,
          content: args.content,
        },
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.id
              ? { ...item, content: variables.content }
              : item,
          ),
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteActivityMutation() {
  const mutation = useMutation({
    mutationFn({ id }: DeleteActivityArgs) {
      return deleteActivity({ data: { activityId: id } });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return mutation.mutate;
}
