import { useAuth } from '@clerk/tanstack-react-start';
import type { Activity } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createActivity,
  deleteActivity,
  getActivity,
  updateActivity,
} from '~/db/activity';
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
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.activity(args.cardId),
    queryFn: () =>
      getActivity({ data: { cardId: args.cardId, userId: userId ?? '' } }),
  });
}

export function useCreateActivityMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: (args: CreateActivityArgs) =>
      createActivity({ data: { ...args, userId: userId ?? '' } }),

    onSuccess: (result, variables) => {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useUpdateActivityMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: (args: UpdateActivityArgs) =>
      updateActivity({
        data: {
          activityId: args.id,
          userId: userId ?? '',
          content: args.content,
        },
      }),

    onSuccess: (_result, variables) => {
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

  return [mutation.mutate] as const;
}

export function useDeleteActivityMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteActivityArgs) =>
      deleteActivity({ data: { activityId: id, userId: userId ?? '' } }),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}
