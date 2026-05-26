import type { Checklist } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

export type ChecklistType = Omit<Checklist, 'createdAt' | 'updatedAt'>;

type ChecklistArgs = Pick<Checklist, 'cardId'>;
export type CreateChecklistArgs = Pick<
  Checklist,
  'checklistTitle' | 'cardId' | 'listId'
>;

export type DeleteChecklistArgs = Pick<Checklist, 'id' | 'cardId'>;

export function useGetChecklistQuery(args: { id: string }) {
  return useQuery({
    queryKey: queryKeys.checklist(args.id),
    queryFn: () =>
      resourceRequest<Checklist>(`checklists/${args.id}`, {
        method: 'GET',
      }),
  });
}

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
    mutationFn({ checklistTitle, cardId, listId }: CreateChecklistArgs) {
      return resourceRequest<{ data: ChecklistType[] }>(
        'checklists',
        { method: 'POST' },
        {
          checklistTitle,
          cardId,
          listId,
        },
      );
    },
    onSuccess(result, variables) {
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
    onSuccess(_result, variables) {
      queryClient.setQueryData<ChecklistType[]>(
        queryKeys.checklists(variables.id),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}
