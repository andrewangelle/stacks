import { useAuth } from '@clerk/tanstack-react-start';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useGetBoardQuery(boardId: string | undefined) {
  const normalizedBoardId = boardId ?? '';

  return useQuery({
    queryKey: queryKeys.board(normalizedBoardId),
    enabled: !!boardId,
    queryFn: () => resourceRequest<Board>(`boards/${normalizedBoardId}`),
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
