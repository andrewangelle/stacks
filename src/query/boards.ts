import type { Stack } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBoard,
  getBoardById,
  getBoards,
  updateBoard,
} from '~/db/boards/boards.functions';
import { queryKeys } from '~/query/queryKeys';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export type Board = Omit<Stack, 'createdAt' | 'updatedAt'>;
export type CreateBoardArgs = Pick<Stack, 'boardTitle' | 'boardColor'>;

export function useGetBoardsQuery() {
  return useQuery({
    queryKey: queryKeys.boards(),
    queryFn() {
      return getBoards({ data: {} });
    },
  });
}

export function useGetBoardQuery() {
  const boardId = useCurrentBoardId();
  return useQuery({
    queryKey: queryKeys.board(boardId),
    enabled: !!boardId,
    queryFn() {
      return getBoardById({ data: { boardId } });
    },
  });
}

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn({ boardTitle, boardColor }: CreateBoardArgs) {
      return createBoard({
        data: { boardTitle, boardColor },
      });
    },

    onSuccess(result) {
      queryClient.setQueryData<Board[]>(queryKeys.boards(), (cache = []) => [
        ...cache,
        result.data[0],
      ]);
    },
  });

  return mutation.mutate;
}

export function useUpdateBoardMutation() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn({ id, boardTitle }: Pick<Board, 'id' | 'boardTitle'>) {
      return updateBoard({
        data: { boardId: id, boardTitle },
      });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<Board>(
        queryKeys.board(variables.id),
        (cache = {} as Board) => ({
          ...cache,
          boardTitle: variables.boardTitle,
        }),
      );
    },
  });

  return mutation.mutate;
}
