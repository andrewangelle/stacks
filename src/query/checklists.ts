import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklist,
  deleteChecklist,
  getCardChecklistView,
  getChecklistById,
  getChecklists,
  updateChecklist,
} from '~/db/checklists/checklists.functions';
import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetCardChecklistViewArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
  UpdateChecklistArgs,
} from '~/db/checklists/checklists.schemas';
import type { Checklist } from '~/generated/prisma/client';
import { queryClient } from '~/query/queryClient';

const queryKeys = {
  list: (cardId: string) => ['checklists', cardId] as const,
  detail: (checklistId: string) => ['checklist', checklistId] as const,
  cardChecklistView: (cardId: string) => ['cardChecklistView', cardId] as const,
};

export const checklistQueryKeys = queryKeys;

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

export function useUpdateChecklist() {
  const mutation = useMutation({
    mutationFn(data: UpdateChecklistArgs) {
      return updateChecklist({
        data,
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<Checklist>(
        queryKeys.detail(variables.checklistId),
        (cache = {} as Checklist) => ({
          ...cache,
          checklistTitle: variables.checklistTitle,
        }),
      );

      queryClient.setQueryData<Checklist[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.checklistId
              ? { ...item, checklistTitle: variables.checklistTitle }
              : item,
          ),
      );
    },
  });

  return mutation.mutate;
}

export function useGetCardChecklistView(data: GetCardChecklistViewArgs) {
  return useQuery({
    queryKey: queryKeys.cardChecklistView(data.cardId),
    queryFn() {
      return getCardChecklistView({
        data,
      });
    },
  });
}
