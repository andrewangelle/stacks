import { useAuth } from '@clerk/tanstack-react-start';
import type { List } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { createList, deleteList, getLists, updateList } from '~/db/lists';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';

export type ListType = Omit<List, 'createdAt' | 'updatedAt'>;

export type UpdateListArgs = Pick<List, 'id' | 'boardId' | 'listTitle'>;
export type CreateListArgs = Pick<List, 'listTitle' | 'boardId'>;
export type DeleteListArgs = Pick<List, 'id' | 'boardId'>;

export function useGetListsQuery() {
  const params = useParams({ strict: false });
  const boardId = params.id ?? '';
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.lists(boardId),
    enabled: !!boardId,
    queryFn: () => getLists({ data: { boardId, userId: userId ?? '' } }),
  });
}

export function useUpdateListMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id, listTitle }: UpdateListArgs) =>
      updateList({ data: { listId: id, userId: userId ?? '', listTitle } }),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<List[]>(
        queryKeys.lists(variables.boardId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.id
              ? { ...item, listTitle: variables.listTitle }
              : item,
          ),
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useCreateListMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: (args: CreateListArgs) =>
      createList({ data: { ...args, userId: userId ?? '' } }),
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
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteListArgs) =>
      deleteList({ data: { listId: id, userId: userId ?? '' } }),
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
