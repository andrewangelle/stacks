import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '~/store/queryKeys';
import { resourceRequest } from '~/store/resourceClient';

export type Board = {
  id: string;
  boardColor: string;
  boardTitle: string;
  userId: string;
};

type CreateBoardArgs = {
  boardTitle: string;
  boardColor: string;
  token: string;
  userId: string;
};

export function useGetBoardsQuery(
  userId: string | undefined,
  options?: { skip?: boolean },
) {
  const normalizedUserId = userId ?? '';

  return useQuery({
    queryKey: queryKeys.boards(normalizedUserId),
    enabled: !options?.skip && !!userId,
    queryFn: () =>
      resourceRequest<Board[]>(
        `boards/get?userId=${encodeURIComponent(normalizedUserId)}`,
      ),
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
    mutationFn: ({ boardTitle, boardColor, token, userId }: CreateBoardArgs) =>
      resourceRequest<{ data: Board[] }>(
        'boards/create',
        { method: 'POST' },
        {
          boardColor,
          boardTitle,
          token,
          userId,
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
