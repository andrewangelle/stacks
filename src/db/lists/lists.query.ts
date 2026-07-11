import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { activityListQueryOptions } from '~/db/activity/activity.query';
import { boardByIdQueryOptions } from '~/db/boards/boards.query';
import { cardByIdQueryOptions } from '~/db/cards/cards.query';
import { cardTitleDetailsChecklistsQueryOptions } from '~/db/checklists/checklists.query';
import type { ListItem } from '~/db/lists/lists.cache';
import { toListItem } from '~/db/lists/lists.cache';
import {
  createList,
  deleteList,
  getLists,
  updateList,
} from '~/db/lists/lists.functions';
import type {
  CreateListArgs,
  DeleteListArgs,
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

/** Loader prefetch: board, lists, and per-card data shown on the board page. */
export async function prefetchBoardPageData(
  queryClient: QueryClient,
  boardId: string,
) {
  await queryClient.ensureQueryData(boardByIdQueryOptions(boardId));
  const lists = await queryClient.ensureQueryData(listsQueryOptions(boardId));

  await Promise.all(
    lists.flatMap((list) =>
      list.cards.flatMap((card) => [
        queryClient.prefetchQuery(cardByIdQueryOptions(card.id)),
        queryClient.prefetchQuery(
          cardTitleDetailsChecklistsQueryOptions(card.id),
        ),
        queryClient.prefetchQuery(
          activityListQueryOptions({ cardId: card.id }),
        ),
      ]),
    ),
  );
}

export function useGetLists() {
  const boardId = useCurrentBoardId();
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
