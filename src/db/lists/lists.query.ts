import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import type { ListItem } from '~/db/lists/lists.cache';
import {
  rollbackListCaches,
  toListItem,
  updateMovedListCache,
} from '~/db/lists/lists.cache';
import {
  createList,
  deleteList,
  getLists,
  moveList,
  updateList,
} from '~/db/lists/lists.functions';
import type {
  CreateListArgs,
  DeleteListArgs,
  MoveListArgs,
  UpdateListArgs,
} from '~/db/lists/lists.schemas';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const queryKeys = {
  list: (boardId: string) => ['lists', boardId] as const,
};

export const listQueryKeys = queryKeys;

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
  return useSuspenseQuery(listsQueryOptions(boardId));
}

export function useGetListsByBoardId({ boardId }: { boardId: string }) {
  return useQuery(listsQueryOptions(boardId));
}

export function useGetListById({ id }: { id: string }) {
  const boardId = useCurrentBoardId();

  return useSuspenseQuery({
    ...listsQueryOptions(boardId),
    select(data) {
      return data.find((item) => item.id === id);
    },
  });
}

export function useGetListCardCount({ listId }: { listId: string }) {
  const boardId = useCurrentBoardId();

  return useSuspenseQuery({
    ...listsQueryOptions(boardId),
    select(data) {
      return data.find((item) => item.id === listId)?.cards.length ?? 0;
    },
  });
}

export function useGetListByCardId({ id }: { id: string }) {
  const boardId = useCurrentBoardId();

  return useSuspenseQuery({
    ...listsQueryOptions(boardId),
    select(data) {
      return data.find((item) => item.cards.some((card) => card.id === id));
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

/**
 * Move a list to a position on another board or reposition it within its own board. Applies a
 * surgical optimistic update across the affected boards' `['lists']` caches so neither board
 * refetches (and re-suspends into its loading skeleton); rolls the caches back if the move fails.
 */
export function useMoveListMutation() {
  return useMutation({
    mutationFn(data: MoveListArgs) {
      return moveList({ data });
    },
    onMutate(variables) {
      return { snapshot: updateMovedListCache(variables) };
    },
    onError(_error, _variables, context) {
      if (context?.snapshot) {
        rollbackListCaches(context.snapshot);
      }
    },
  });
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
