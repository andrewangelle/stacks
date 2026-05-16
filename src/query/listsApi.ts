import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

export type List = {
  boardId: string;
  id: string;
  listTitle: string;
  userId: string;
};

type ListsArgs = { boardId?: string };

type UpdateListArgs = {
  boardId: string;
  listId: string;
  listTitle: string;
};

type CreateListArgs = {
  listTitle: string;
  boardId: string;
};

type DeleteListArgs = {
  id: string;
  boardId: string;
};

export function useGetListsQuery(
  args: ListsArgs,
  options?: { skip?: boolean },
) {
  const boardId = args.boardId ?? '';

  return useQuery({
    queryKey: queryKeys.lists(boardId),
    enabled: !options?.skip && !!args.boardId,
    queryFn: () =>
      resourceRequest<List[]>('lists', {
        method: 'GET',
        searchParams: { boardId },
      }),
  });
}

export function useUpdateListMutation() {
  const mutation = useMutation({
    mutationFn: ({ listId, listTitle }: UpdateListArgs) =>
      resourceRequest<void>(
        `lists/${listId}`,
        { method: 'PUT' },
        {
          listTitle,
        },
      ),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<List[]>(
        queryKeys.lists(variables.boardId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.listId
              ? { ...item, listTitle: variables.listTitle }
              : item,
          ),
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useCreateListMutation() {
  const mutation = useMutation({
    mutationFn: (args: CreateListArgs) =>
      resourceRequest<{ data: List[] }>('lists', { method: 'POST' }, args),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<List[]>(
        queryKeys.lists(variables.boardId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useDeleteListMutation() {
  const mutation = useMutation({
    mutationFn: ({ id, boardId }: DeleteListArgs) =>
      resourceRequest<{ data: List[] }>(
        `lists/${id}`,
        { method: 'DELETE' },
        {
          id,
          boardId,
        },
      ),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<List[]>(
        queryKeys.lists(variables.boardId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}

export const reorderLists = (item: List, boardId: string, droppedId: string) =>
  queryClient.setQueryData<List[]>(queryKeys.lists(boardId), (cache = []) => {
    const cacheArray = [...cache];

    const draggedIndex = cacheArray.findIndex(
      (cacheItem) => cacheItem.id === item.id,
    );

    const droppedIndex = cacheArray.findIndex(
      (cacheItem) => cacheItem.id === droppedId,
    );

    cacheArray.splice(droppedIndex, 0, cacheArray.splice(draggedIndex, 1)[0]);

    return cacheArray;
  });
