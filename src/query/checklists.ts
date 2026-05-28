import type { Checklist } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklist,
  deleteChecklist,
  getChecklistById,
  getChecklists,
} from '~/db/checklists/checklists.functions';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';

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
    queryFn() {
      return getChecklistById({
        data: { checklistId: args.id },
      });
    },
  });
}

export function useGetChecklistsQuery(args: ChecklistArgs) {
  return useQuery({
    queryKey: queryKeys.checklists(args.cardId),
    queryFn() {
      return getChecklists({
        data: { cardId: args.cardId },
      });
    },
  });
}

export function useCreateChecklistMutation() {
  const mutation = useMutation({
    mutationFn({ checklistTitle, cardId, listId }: CreateChecklistArgs) {
      return createChecklist({
        data: { checklistTitle, cardId, listId },
      });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<ChecklistType[]>(
        queryKeys.checklists(variables.cardId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklistMutation() {
  const mutation = useMutation({
    mutationFn({ id }: DeleteChecklistArgs) {
      return deleteChecklist({
        data: { checklistId: id },
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<ChecklistType[]>(
        queryKeys.checklists(variables.id),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return mutation.mutate;
}
