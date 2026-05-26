import type { Activity } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

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
    queryFn: () =>
      resourceRequest<Activity[]>('activity', {
        method: 'GET',
        searchParams: { cardId: args.cardId },
      }),
  });
}

export function useCreateActivityMutation() {
  const mutation = useMutation({
    mutationFn: (args: CreateActivityArgs) =>
      resourceRequest<{ data: Activity[] }>(
        'activity',
        { method: 'POST' },
        args,
      ),

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
  const mutation = useMutation({
    mutationFn: (args: UpdateActivityArgs) =>
      resourceRequest<{ data: Activity[] }>(
        `activity/${args.id}`,
        { method: 'PUT' },
        {
          content: args.content,
        },
      ),

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
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteActivityArgs) =>
      resourceRequest<{ data: Activity[] }>(`activity/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<Activity[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}
