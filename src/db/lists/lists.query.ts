import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createList,
  deleteList,
  getLists,
  reorderLists as reorderListsServer,
  updateList,
} from '~/db/lists/lists.functions';
import type {
  CreateListArgs,
  DeleteListArgs,
  UpdateListArgs,
} from '~/db/lists/lists.schemas';
import type { List } from '~/generated/prisma/client';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export type ListItem = Pick<List, 'id' | 'listTitle' | 'createdAt'>;

function toListItem(item: List): ListItem {
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
  const boardId = useCurrentBoardId();

  return useQuery({
    ...listsQueryOptions(boardId),
    queryKey: queryKeys.detail(id),
    select(data) {
      return data.find((item) => item.id === id);
    },
  });
}

export function useUpdateList() {
  const queryClient = useQueryClient();
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

      queryClient.setQueryData<ListItem[]>(
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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(args: CreateListArgs) {
      return createList({ data: args });
    },
    onSuccess(result, variables) {
      queryClient.setQueryData<ListItem[]>(
        queryKeys.list(variables.boardId),
        (cache = []) => [...cache, toListItem(result.data[0])],
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteList() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: DeleteListArgs) {
      return deleteList({ data });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<ListItem[]>(
        queryKeys.list(variables.boardId),
        (cache = []) => cache.filter((item) => item.id !== variables.listId),
      );
    },
  });

  return mutation.mutate;
}

export const reorderListsByIndex = (
  boardId: string,
  fromIndex: number,
  toIndex: number,
) => {
  const queryClient = useQueryClient();
  queryClient.setQueryData<ListItem[]>(
    queryKeys.list(boardId),
    (cache = []) => {
      const next = [...cache];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    },
  );

  const orderedIds =
    queryClient
      .getQueryData<ListItem[]>(queryKeys.list(boardId))
      ?.map((list) => list.id) ?? [];

  reorderListsServer({ data: { boardId, orderedIds } }).catch(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.list(boardId) });
  });
};
