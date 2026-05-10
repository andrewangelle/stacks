import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/store/queryClient';
import { queryKeys } from '~/store/queryKeys';
import { resourceRequest } from '~/store/resourceClient';

export type ChecklistType = {
  id: string;
  created_at: string;
  checklistTitle: string;
  cardId: string;
  userId: string;
  listId: string;
};

type ChecklistArgs = { cardId: string };

type CreateChecklistArgs = {
  checklistTitle: string;
  cardId: string;
  listId: string;
};

type DeleteChecklistArgs = {
  id: string;
  cardId: string;
};

export function useGetChecklistsQuery(args: ChecklistArgs) {
  return useQuery({
    queryKey: queryKeys.checklists(args.cardId),
    queryFn: () =>
      resourceRequest<ChecklistType[]>('checklists', {
        method: 'GET',
        searchParams: { cardId: args.cardId },
      }),
  });
}

export function useCreateChecklistMutation() {
  const mutation = useMutation({
    mutationFn: ({ checklistTitle, cardId, listId }: CreateChecklistArgs) =>
      resourceRequest<{ data: ChecklistType[] }>(
        'checklists',
        { method: 'POST' },
        {
          checklistTitle,
          cardId,
          listId,
        },
      ),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<ChecklistType[]>(
        queryKeys.checklists(variables.cardId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useDeleteChecklistMutation() {
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteChecklistArgs) =>
      resourceRequest<{ data: ChecklistType[] }>(`checklists/${id}`, {
        method: 'DELETE',
      }),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<ChecklistType[]>(
        queryKeys.checklists(variables.cardId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}
