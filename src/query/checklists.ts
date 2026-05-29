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
import { queryKeys } from '~/query/queryKeys';

export function useGetChecklistQuery(data: GetChecklistByIdArgs) {
  return useQuery({
    queryKey: queryKeys.checklist(data.checklistId),
    queryFn() {
      return getChecklistById({
        data,
      });
    },
  });
}

export function useGetChecklistsQuery(data: GetChecklistsArgs) {
  return useQuery({
    queryKey: queryKeys.checklists(data.cardId),
    queryFn() {
      return getChecklists({
        data,
      });
    },
  });
}

export function useCreateChecklistMutation() {
  const mutation = useMutation({
    mutationFn(data: CreateChecklistArgs) {
      return createChecklist({
        data,
      });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<Checklist[]>(
        queryKeys.checklists(variables.cardId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklistMutation() {
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistArgs) {
      return deleteChecklist({
        data,
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Checklist[]>(
        queryKeys.checklists(variables.cardId),
        (cache = []) =>
          cache.filter((item) => item.id !== variables.checklistId),
      );
    },
  });

  return mutation.mutate;
}
