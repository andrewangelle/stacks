import type { List } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createList,
  deleteList,
  getListById,
  getLists,
  updateList,
} from '~/db/lists/lists.functions';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export type UpdateListArgs = Pick<List, 'id' | 'boardId' | 'listTitle'>;
export type CreateListArgs = Pick<List, 'listTitle' | 'boardId'>;
export type DeleteListArgs = Pick<List, 'id' | 'boardId'>;

export function useGetListsQuery() {
  const boardId = useCurrentBoardId();
  return useQuery({
    queryKey: queryKeys.lists(boardId),
    enabled: !!boardId,
    queryFn() {
      return getLists({ data: { boardId } });
    },
  });
}

export function useGetListByIdQuery({ id }: { id: string }) {
  return useQuery({
    queryKey: queryKeys.list(id),
    enabled: !!id,
    queryFn() {
      return getListById({ data: { id } });
    },
  });
}

export function useUpdateListMutation() {
  const mutation = useMutation({
    mutationFn({ id, listTitle }: UpdateListArgs) {
      return updateList({
        data: { listId: id, listTitle },
      });
    },

    onSuccess(_result, variables) {
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

  return mutation.mutate;
}

export function useCreateListMutation() {
  const mutation = useMutation({
    mutationFn(args: CreateListArgs) {
      return createList({ data: args });
    },
    onSuccess(result, variables) {
      queryClient.setQueryData<List[]>(
        queryKeys.lists(variables.boardId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteListMutation() {
  const mutation = useMutation({
    mutationFn({ id }: DeleteListArgs) {
      return deleteList({ data: { listId: id } });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<List[]>(
        queryKeys.lists(variables.boardId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return mutation.mutate;
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
