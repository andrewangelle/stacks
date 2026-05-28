import { useAuth } from '@clerk/tanstack-react-start';
import type { Checklist } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklist,
  deleteChecklist,
  getChecklistById,
  getChecklists,
} from '~/db/checklists';
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
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.checklist(args.id),
    queryFn: () =>
      getChecklistById({
        data: { checklistId: args.id, userId: userId ?? '' },
      }),
  });
}

export function useGetChecklistsQuery(args: ChecklistArgs) {
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.checklists(args.cardId),
    queryFn: () =>
      getChecklists({ data: { cardId: args.cardId, userId: userId ?? '' } }),
  });
}

export function useCreateChecklistMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn({ checklistTitle, cardId, listId }: CreateChecklistArgs) {
      return createChecklist({
        data: { checklistTitle, cardId, listId, userId: userId ?? '' },
      });
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
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteChecklistArgs) =>
      deleteChecklist({ data: { checklistId: id, userId: userId ?? '' } }),
    onSuccess(_result, variables) {
      queryClient.setQueryData<ChecklistType[]>(
        queryKeys.checklists(variables.id),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}
