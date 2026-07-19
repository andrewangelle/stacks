import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import {
  type BoardsPayload,
  boardsQueryKey,
  findBoard,
  getBoardsCache,
  patchBoard,
  restoreBoardsCache,
  setBoardsCache,
} from '~/db/boards/boards.cache';
import {
  createBoard,
  getBoards,
  updateBoard,
} from '~/db/boards/boards.functions';
import type {
  CreateBoardArgs,
  UpdateBoardArgs,
} from '~/db/boards/boards.schemas';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export const boardsQueryOptions = {
  queryKey: boardsQueryKey,
  queryFn() {
    return getBoards();
  },
};

export function useGetBoards() {
  return useSuspenseQuery(boardsQueryOptions);
}

export function boardByIdQueryOptions(boardId: string) {
  return {
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findBoard(boards, boardId);
    },
  };
}

export function useGetBoard() {
  const boardId = useCurrentBoardId();
  return useSuspenseQuery(boardByIdQueryOptions(boardId));
}

export function useGetBoardById({ id }: { id: string }) {
  return useSuspenseQuery(boardByIdQueryOptions(id));
}

export function useCreateBoard() {
  const mutation = useMutation({
    mutationFn(data: CreateBoardArgs) {
      return createBoard({
        data,
      });
    },

    onSuccess(result) {
      if (result) {
        setBoardsCache((boards) => [...boards, { ...result, lists: [] }]);
      }
    },
  });

  return mutation.mutate;
}

export function useUpdateBoard() {
  const mutation = useMutation({
    mutationFn({ boardId, boardTitle, boardColor }: UpdateBoardArgs) {
      return updateBoard({
        data: { boardId, boardTitle, boardColor },
      });
    },

    onMutate(variables) {
      const snapshot = getBoardsCache();

      patchBoard(variables.boardId, (board) => ({
        ...board,
        boardTitle: variables.boardTitle,
        boardColor: variables.boardColor ?? board.boardColor,
      }));

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });

  return mutation.mutate;
}
