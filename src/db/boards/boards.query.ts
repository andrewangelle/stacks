import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  createBoard,
  getBoardById,
  getBoards,
  updateBoard,
} from '~/db/boards/boards.functions';
import type {
  CreateBoardArgs,
  UpdateBoardArgs,
} from '~/db/boards/boards.schemas';
import type { Stack } from '~/generated/prisma/client';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

const queryKeys = {
  list: () => ['boards'] as const,
  detail: (boardId: string) => ['board', boardId] as const,
};

export const boardsQueryOptions = {
  queryKey: queryKeys.list(),
  queryFn() {
    return getBoards();
  },
};

export function useGetBoards() {
  return useSuspenseQuery<Stack[]>(boardsQueryOptions);
}

export function boardByIdQueryOptions(boardId: string) {
  return {
    queryKey: queryKeys.detail(boardId),
    enabled: !!boardId,
    queryFn() {
      return getBoardById({ data: { boardId } });
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
  const queryClient = useQueryClient();
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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn({ boardId, boardTitle, boardColor }: UpdateBoardArgs) {
      return updateBoard({
        data: { boardId, boardTitle, boardColor },
      });
    },
    onMutate(variables) {
      queryClient.setQueryData<Stack>(
        queryKeys.detail(variables.boardId),
        (cache = {} as Stack) => ({
          ...cache,
          boardTitle: variables.boardTitle,
          boardColor: variables.boardColor ?? cache.boardColor,
        }),
      );
    },
    onError(_error, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.detail(variables.boardId),
      });
    },
  });

  return mutation.mutate;
}
