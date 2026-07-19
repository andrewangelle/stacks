import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query';
import {
  type BoardsPayload,
  type CardPayload,
  findBoard,
  findList,
  getBoardsCache,
  type ListPayload,
  patchBoardLists,
  patchList,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { toCardChecklistView } from '~/db/checklists/checklists.cache';
import { moveListInBoardsCache } from '~/db/lists/lists.cache';
import {
  createList,
  deleteList,
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

/**
 * The shape the board page renders: a list with its card fronts, where
 * `commentsCount` and `checklistView` are derived from the card's activities
 * and checklists in the boards tree.
 */
export type ListCardItem = ReturnType<typeof toListCardItem>;
export type ListItem = ReturnType<typeof toListItem>;

export function toListCardItem(card: CardPayload) {
  return {
    id: card.id,
    cardTitle: card.cardTitle,
    cardDescription: card.cardDescription,
    isCompleted: card.isCompleted,
    position: card.position,
    createdAt: card.createdAt,
    commentsCount: card.activities.filter(
      (activity) => activity.type === 'comment',
    ).length,
    checklistView: toCardChecklistView(card),
  };
}

export function toListItem(list: ListPayload) {
  return {
    id: list.id,
    listTitle: list.listTitle,
    createdAt: list.createdAt,
    position: list.position,
    boardId: list.boardId,
    cards: list.cards.map(toListCardItem),
  };
}

export function listsQueryOptions(boardId: string) {
  return {
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findBoard(boards, boardId)?.lists.map(toListItem) ?? [];
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
  return useSuspenseQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      const list = findList(boards, id);
      return list ? toListItem(list) : undefined;
    },
  });
}

export function useGetListCardCount({ listId }: { listId: string }) {
  return useSuspenseQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findList(boards, listId)?.cards.length ?? 0;
    },
  });
}

export function useGetListByCardId({ id }: { id: string }) {
  return useSuspenseQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      for (const board of boards) {
        const list = board.lists.find((item) =>
          item.cards.some((card) => card.id === id),
        );

        if (list) {
          return toListItem(list);
        }
      }

      return undefined;
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

    onMutate(variables) {
      const snapshot = getBoardsCache();

      patchList(variables.listId, (list) => ({
        ...list,
        listTitle: variables.listTitle,
      }));

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
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
      patchBoardLists(variables.boardId, (lists) => [
        ...lists,
        { ...result.data[0], cards: [] },
      ]);
    },
  });

  return mutation.mutate;
}

/**
 * Move a list to a position on another board or reposition it within its own
 * board. The optimistic patch moves the list inside the boards tree, so neither
 * board refetches (and re-suspends into its loading skeleton); the snapshot
 * restores the tree if the move fails.
 */
export function useMoveListMutation() {
  return useMutation({
    mutationFn(data: MoveListArgs) {
      return moveList({ data });
    },
    onMutate(variables) {
      const snapshot = getBoardsCache();
      moveListInBoardsCache(variables);
      return { snapshot };
    },
    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });
}

export function useDeleteList() {
  const mutation = useMutation({
    mutationFn(data: DeleteListArgs) {
      return deleteList({ data });
    },

    onMutate(variables) {
      const snapshot = getBoardsCache();

      patchBoardLists(variables.boardId, (lists) =>
        lists.filter((list) => list.id !== variables.listId),
      );

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });

  return mutation.mutate;
}
