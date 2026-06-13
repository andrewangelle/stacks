import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklist,
  deleteChecklist,
  getCardTitleDetailsChecklists,
  getChecklistById,
  getChecklists,
  updateChecklist,
} from '~/db/checklists/checklists.functions';
import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
  UpdateChecklistArgs,
} from '~/db/checklists/checklists.schemas';
import type { Checklist } from '~/generated/prisma/client';
import { queryClient } from '~/query/queryClient';

export type ChecklistListItem = Pick<Checklist, 'id' | 'createdAt'>;

function toChecklistListItem(item: Checklist): ChecklistListItem {
  return { id: item.id, createdAt: item.createdAt };
}

const queryKeys = {
  list: (cardId: string) => ['checklists', cardId] as const,
  detail: (checklistId: string) => ['checklist', checklistId] as const,
  cardChecklistView: (cardId: string) => ['cardChecklistView', cardId] as const,
};

export const checklistQueryKeys = queryKeys;

function invalidateCardChecklistView(cardId: string) {
  queryClient.invalidateQueries({
    queryKey: queryKeys.cardChecklistView(cardId),
  });
}

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
      queryClient.setQueryData<ChecklistListItem[]>(
        queryKeys.list(variables.cardId),
        (cache = []) => [...cache, toChecklistListItem(result.data[0])],
      );
      invalidateCardChecklistView(variables.cardId);
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
      queryClient.setQueryData<ChecklistListItem[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.filter((item) => item.id !== variables.checklistId),
      );
      queryClient.removeQueries({
        queryKey: queryKeys.detail(variables.checklistId),
      });
      invalidateCardChecklistView(variables.cardId);
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklist() {
  return useMutation({
    mutationFn(data: UpdateChecklistArgs) {
      return updateChecklist({
        data,
      });
    },

    onSuccess(_result, variables) {
      const patch: Partial<Checklist> = {};

      if (variables.checklistTitle !== undefined) {
        patch.checklistTitle = variables.checklistTitle;
      }

      if (variables.hideCheckedItems !== undefined) {
        patch.hideCheckedItems = variables.hideCheckedItems;
      }

      queryClient.setQueryData<Checklist>(
        queryKeys.detail(variables.checklistId),
        (cache = {} as Checklist) => ({
          ...cache,
          ...patch,
        }),
      );

      queryClient.setQueryData<Checklist[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.checklistId ? { ...item, ...patch } : item,
          ),
      );
    },
  });
}

export function useGetCardTitleDetailsChecklists(data: GetChecklistsArgs) {
  return useQuery({
    queryKey: queryKeys.cardChecklistView(data.cardId),
    queryFn() {
      return getCardTitleDetailsChecklists({
        data,
      });
    },
    select(data) {
      const checklistsWithIncompleteItems = data.checklists.filter(
        (checklist) => checklist.completedItems < checklist.totalItems,
      );
      return {
        completedItemsForCard: data.completedItemsForCard,
        totalItemsForCard: data.totalItemsForCard,
        checklists: checklistsWithIncompleteItems,
        isAllCompleted: data.completedItemsForCard === data.totalItemsForCard,
        hasMultiple: checklistsWithIncompleteItems.length > 1,
        singleChecklistId: checklistsWithIncompleteItems[0]?.id,
      };
    },
  });
}
