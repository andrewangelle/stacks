import type { ChecklistItem } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklistItemById,
  getChecklistItems,
  updateChecklistItem,
} from '~/db/checklistItems/checklistItems.functions';
import type {
  CreateChecklistItemArgs,
  DeleteChecklistItemArgs,
  GetChecklistItemByIdArgs,
  GetChecklistItemsArgs,
  UpdateChecklistItemArgs,
} from '~/db/checklistItems/checklistItems.schemas';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';

export function useGetChecklistItemQuery(data: GetChecklistItemByIdArgs) {
  return useQuery({
    queryKey: queryKeys.checklistItem(data.itemId),
    queryFn() {
      return getChecklistItemById({
        data,
      });
    },
  });
}

export function useGetChecklistItemsQuery(data: GetChecklistItemsArgs) {
  return useQuery({
    queryKey: queryKeys.checklistItems(data.checklistId),
    queryFn() {
      return getChecklistItems({
        data,
      });
    },
  });
}

export function useCreateChecklistItemMutation() {
  const mutation = useMutation({
    mutationFn(data: CreateChecklistItemArgs) {
      return createChecklistItem({
        data,
      });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<ChecklistItem[]>(
        queryKeys.checklistItems(variables.checklistId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklistItemMutation() {
  const mutation = useMutation({
    mutationFn(data: UpdateChecklistItemArgs) {
      return updateChecklistItem({
        data,
      });
    },
    onSuccess(_result, variables) {
      const checklistId = queryClient.getQueryData<ChecklistItem>(
        queryKeys.checklistItem(variables.itemId),
      )?.checklistId;

      if (checklistId) {
        queryClient.setQueryData<ChecklistItem[]>(
          queryKeys.checklistItems(checklistId),
          (cache = [] as ChecklistItem[]) =>
            cache.map((item) => {
              if (item.id === variables.itemId) {
                return {
                  ...item,
                  isCompleted: variables.isCompleted ?? item.isCompleted,
                  label: variables.label ?? item.label,
                };
              }
              return item;
            }),
        );
      }

      queryClient.setQueryData<ChecklistItem>(
        queryKeys.checklistItem(variables.itemId),
        (cache = {} as ChecklistItem) => ({
          ...cache,
          isCompleted: variables.isCompleted ?? cache.isCompleted,
          label: variables.label ?? cache.label,
        }),
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklistItemMutation() {
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistItemArgs) {
      return deleteChecklistItem({
        data,
      });
    },
    onSuccess(result, variables) {
      const checklistId =
        result.data[0]?.checklistId ??
        queryClient.getQueryData<ChecklistItem>(
          queryKeys.checklistItem(variables.itemId),
        )?.checklistId;

      if (checklistId) {
        queryClient.setQueryData<ChecklistItem[]>(
          queryKeys.checklistItems(checklistId),
          (cache = []) => cache.filter((item) => item.id !== variables.itemId),
        );
      }
    },
  });

  return mutation.mutate;
}

export const reorderChecklistItems = (
  item: ChecklistItem,
  checklistId: string,
  droppedId: string,
) =>
  queryClient.setQueryData<ChecklistItem[]>(
    queryKeys.checklistItems(checklistId),
    (cache = []) => {
      const cacheArray = [...cache];
      const draggedIndex = cacheArray.findIndex(
        (cacheItem) => cacheItem.id === item.id,
      );
      const droppedIndex = cacheArray.findIndex(
        (cacheItem) => cacheItem.id === droppedId,
      );

      cacheArray.splice(droppedIndex, 0, cacheArray.splice(draggedIndex, 1)[0]);

      return cacheArray;
    },
  );
