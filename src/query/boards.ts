import { useAuth } from '@clerk/tanstack-react-start';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from '@tanstack/react-router';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

export type Board = {
  id: string;
  boardColor: string;
  boardTitle: string;
  userId: string;
};

type CreateBoardArgs = {
  boardTitle: string;
  boardColor: string;
  userId: string;
};

export function useGetBoardsQuery() {
  const { userId, isSignedIn } = useAuth();
  return useQuery({
    queryKey: queryKeys.boards(userId ?? ''),
    enabled: isSignedIn,
    queryFn: () =>
      resourceRequest<Board[]>('boards', {
        method: 'GET',
      }),
  });
}

export function useGetBoardQuery() {
  const params = useParams({ strict: false });
  const boardId = params.id ?? '';

  return useQuery({
    queryKey: queryKeys.board(boardId),
    enabled: !!boardId,
    queryFn: () => resourceRequest<Board>(`boards/${boardId}`),
  });
}

export function useCreateBoardMutation() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ boardTitle, boardColor }: CreateBoardArgs) =>
      resourceRequest<{ data: Board[] }>(
        'boards',
        { method: 'POST' },
        {
          boardColor,
          boardTitle,
        },
      ),
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

  const mutation = useMutation({
    mutationFn: ({ id, boardTitle }: Pick<Board, 'id' | 'boardTitle'>) =>
      resourceRequest<void>(`boards/${id}`, { method: 'PUT' }, { boardTitle }),
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
