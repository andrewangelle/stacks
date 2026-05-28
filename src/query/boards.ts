import { useAuth } from '@clerk/tanstack-react-start';
import type { Stack } from '@prisma/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { createBoard, getBoardById, getBoards, updateBoard } from '~/db/boards';
import { queryKeys } from '~/query/queryKeys';

export type Board = Omit<Stack, 'createdAt' | 'updatedAt'>;
export type CreateBoardArgs = Pick<
  Stack,
  'boardTitle' | 'boardColor' | 'userId'
>;

export function useGetBoardsQuery() {
  const { userId, isSignedIn } = useAuth();
  return useQuery({
    queryKey: queryKeys.boards(userId ?? ''),
    enabled: isSignedIn,
    queryFn: () => getBoards({ data: { userId: userId ?? '' } }),
  });
}

export function useGetBoardQuery() {
  const params = useParams({ strict: false });
  const boardId = params.id ?? '';
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.board(boardId),
    enabled: !!boardId,
    queryFn: () => getBoardById({ data: { boardId, userId: userId ?? '' } }),
  });
}

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();

  const mutation = useMutation({
    mutationFn: ({ boardTitle, boardColor }: CreateBoardArgs) =>
      createBoard({ data: { userId: userId ?? '', boardTitle, boardColor } }),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<Board[]>(
        queryKeys.boards(variables.userId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useUpdateBoardMutation() {
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id, boardTitle }: Pick<Board, 'id' | 'boardTitle'>) =>
      updateBoard({ data: { boardId: id, userId: userId ?? '', boardTitle } }),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<Board>(
        queryKeys.board(variables.id),
        (cache = {} as Board) => ({
          ...cache,
          boardTitle: variables.boardTitle,
        }),
      );
    },
  });

  return [mutation.mutate] as const;
}
