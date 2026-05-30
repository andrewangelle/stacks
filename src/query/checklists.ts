import type { Checklist } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklist,
  deleteChecklist,
  getChecklistById,
  getChecklists,
} from '~/db/checklists/checklists.functions';
import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
} from '~/db/checklists/checklists.schemas';
import { queryClient } from '~/query/queryClient';

const queryKeys = {
  list: (cardId: string) => ['checklists', cardId] as const,
  detail: (checklistId: string) => ['checklist', checklistId] as const,
};

export function useGetChecklist(data: GetChecklistByIdArgs) {
  return useQuery({
    queryKey: queryKeys.detail(data.checklistId),
    queryFn() {
      return getChecklistById({
        data,
      });
    },
  });
}

export function useGetChecklists(data: GetChecklistsArgs) {
  return useQuery({
    queryKey: queryKeys.list(data.cardId),
    queryFn() {
      return getChecklists({
        data,
      });
    },
  });
}

export function useCreateChecklist() {
  const mutation = useMutation({
    mutationFn(data: CreateChecklistArgs) {
      return createChecklist({
        data,
      });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<Checklist[]>(
        queryKeys.list(variables.cardId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklist() {
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistArgs) {
      return deleteChecklist({
        data,
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Checklist[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.filter((item) => item.id !== variables.checklistId),
      );
    },
  });

  return mutation.mutate;
}
