import type { Stack } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createBoard,
  getBoardById,
  getBoards,
  updateBoard,
} from '~/db/boards/boards.functions';
import type { CreateBoardArgs } from '~/db/boards/boards.schemas';
import { queryClient } from '~/query/queryClient';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const queryKeys = {
  list: () => ['boards'] as const,
  detail: (boardId: string) => ['board', boardId] as const,
};

export function useGetBoards() {
  return useQuery({
    queryKey: queryKeys.list(),
    queryFn() {
      return getBoards();
    },
  });
}

export function useGetBoard() {
  const boardId = useCurrentBoardId();
  return useQuery({
    queryKey: queryKeys.detail(boardId),
    enabled: !!boardId,
    queryFn() {
      return getBoardById({ data: { boardId } });
    },
  });
}

export function useCreateBoard() {
  const mutation = useMutation({
    mutationFn(data: CreateBoardArgs) {
      return createBoard({
        data,
      });
    },

    onSuccess(result) {
      queryClient.setQueryData<Stack[]>(queryKeys.list(), (cache = []) => {
        if (result) {
          return [...cache, result];
        }
        return cache;
      });
    },
  });

  return mutation.mutate;
}

export function useUpdateBoard() {
  const mutation = useMutation({
    mutationFn({ id, boardTitle }: Pick<Stack, 'id' | 'boardTitle'>) {
      return updateBoard({
        data: { boardId: id, boardTitle },
      });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<Stack>(
        queryKeys.detail(variables.id),
        (cache = {} as Stack) => ({
          ...cache,
          boardTitle: variables.boardTitle,
        }),
      );
    },
  });

  return mutation.mutate;
}
