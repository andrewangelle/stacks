import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createList,
  deleteList,
  getListById,
  getLists,
  updateList,
} from '~/db/lists/lists.functions';
import type {
  CreateListArgs,
  DeleteListArgs,
  UpdateListArgs,
} from '~/db/lists/lists.schemas';
import type { List } from '~/generated/prisma/client';
import { queryClient } from '~/query/queryClient';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export type ListListItem = Pick<List, 'id' | 'listTitle' | 'createdAt'>;

function toListListItem(item: List): ListListItem {
  return { id: item.id, listTitle: item.listTitle, createdAt: item.createdAt };
}

const queryKeys = {
  list: (boardId: string) => ['lists', boardId] as const,
  detail: (id: string) => ['list', id] as const,
};

export function listsQueryOptions(boardId: string) {
  return {
    queryKey: queryKeys.list(boardId),
    enabled: !!boardId,
    queryFn() {
      return getLists({ data: { boardId } });
    },
  };
}

export function useGetLists() {
  const boardId = useCurrentBoardId();
  return useQuery(listsQueryOptions(boardId));
}

export function useGetListById({ id }: { id: string }) {
  return useQuery({
    queryKey: queryKeys.detail(id),
    enabled: !!id,
    queryFn() {
      return getListById({ data: { id } });
    },
  });
}

export function useUpdateList() {
  const mutation = useMutation({
    mutationFn(data: UpdateListArgs) {
      return updateList({
        data,
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<List>(
        queryKeys.detail(variables.listId),
        (cache = {} as List) => ({
          ...cache,
          listTitle: variables.listTitle,
        }),
      );

      queryClient.setQueryData<ListListItem[]>(
        queryKeys.list(variables.boardId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.listId
              ? { ...item, listTitle: variables.listTitle }
              : item,
          ),
      );
    },
  });

  return mutation.mutate;
}

export function useCreateList() {
  const mutation = useMutation({
    mutationFn(args: CreateListArgs) {
      return createList({ data: args });
    },
    onSuccess(result, variables) {
      queryClient.setQueryData<ListListItem[]>(
        queryKeys.list(variables.boardId),
        (cache = []) => [...cache, toListListItem(result.data[0])],
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteList() {
  const mutation = useMutation({
    mutationFn(data: DeleteListArgs) {
      return deleteList({ data });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<ListListItem[]>(
        queryKeys.list(variables.boardId),
        (cache = []) => cache.filter((item) => item.id !== variables.listId),
      );
    },
  });

  return mutation.mutate;
}

export const reorderLists = (
  item: { id: string },
  boardId: string,
  droppedId: string,
) =>
  queryClient.setQueryData<ListListItem[]>(
    queryKeys.list(boardId),
    (cache = []) => {
      const cacheArray = [...cache];

      const draggedIndex = cacheArray.findIndex(
        (cacheItem) => cacheItem.id === item.id,
      );

      const droppedIndex = cacheArray.findIndex(
        (cacheItem) => cacheItem.id === droppedId,
      );

      cacheArray.splice(droppedIndex, 0, cacheArray.splice(draggedIndex, 1)[0]);

      return cacheArray;
    },
  );
