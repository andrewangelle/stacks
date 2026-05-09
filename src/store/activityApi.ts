import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/store/queryClient';
import { queryKeys } from '~/store/queryKeys';
import { resourceRequest } from '~/store/resourceClient';

export type ActivityType = {
  id: string;
  created_at: string;
  listId: string;
  cardId: string;
  boardId: string;
  content: string;
  type: string;
};

type ActivityArgs = { cardId: string };

type CreateActivityArgs = {
  token: string;
  userId: string;
  cardId: string;
  listId: string;
  boardId: string;
  content: string;
  type: string;
};

type UpdateActivityArgs = {
  id: string;
  token: string;
  cardId: string;
  content: string;
};

type DeleteActivityArgs = {
  id: string;
  token: string;
  cardId: string;
};

export function useGetActivityQuery(args: ActivityArgs) {
  return useQuery({
    queryKey: queryKeys.activity(args.cardId),
    queryFn: () =>
      resourceRequest<ActivityType[]>(
        'activity/get',
        { method: 'POST' },
        {
          cardId: args.cardId,
        },
      ),
  });
}

export function useCreateActivityMutation() {
  const mutation = useMutation({
    mutationFn: (args: CreateActivityArgs) =>
      resourceRequest<{ data: ActivityType[] }>(
        'activity/create',
        { method: 'POST' },
        args,
      ),

    onSuccess: (result, variables) => {
      queryClient.setQueryData<ActivityType[]>(
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
      resourceRequest<{ data: ActivityType[] }>(
        `activity/${args.id}`,
        { method: 'PUT' },
        args,
      ),

    onSuccess: (_result, variables) => {
      queryClient.setQueryData<ActivityType[]>(
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
    mutationFn: ({ token, id }: DeleteActivityArgs) =>
      resourceRequest<{ data: ActivityType[] }>(
        `activity/${id}`,
        { method: 'DELETE' },
        {
          token,
        },
      ),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<ActivityType[]>(
        queryKeys.activity(variables.cardId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}
