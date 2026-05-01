import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/store/queryClient';
import { queryKeys } from '~/store/queryKeys';
import { resourceRequest } from '~/store/resourceClient';

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
  token: string;
  userId: string;
};

type CreateListArgs = {
  listTitle: string;
  boardId: string;
  token: string;
  userId: string;
};

type DeleteListArgs = {
  id: string;
  userId: string;
  boardId: string;
  token: string;
};

export function useGetListsQuery(
  args: ListsArgs,
  options?: { skip?: boolean },
) {
  const boardId = args.boardId ?? '';

  return useQuery({
    queryKey: queryKeys.lists(boardId),
    enabled: !options?.skip && !!args.boardId,
    queryFn: () => resourceRequest<List[]>('lists/get', 'POST', { boardId }),
  });
}

export function useUpdateListMutation() {
  const mutation = useMutation({
    mutationFn: ({ listId, listTitle, token, userId }: UpdateListArgs) =>
      resourceRequest<void>(`lists/${listId}`, 'PUT', {
        listTitle,
        token,
        userId,
      }),
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
      resourceRequest<{ data: List[] }>('lists/create', 'POST', args),
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
    mutationFn: ({ token, id, boardId, userId }: DeleteListArgs) =>
      resourceRequest<{ data: List[] }>(`lists/${id}`, 'DELETE', {
        id,
        boardId,
        token,
        userId,
      }),
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
