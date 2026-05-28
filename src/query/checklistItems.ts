import type { ChecklistItem } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklistItemById,
  getChecklistItems,
  updateChecklistItem,
} from '~/db/checklistItems/checklistItems.functions';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';

export type ChecklistItemType = Omit<ChecklistItem, 'createdAt' | 'updatedAt'>;

export type ChecklistItemsArgs = { checklistId: string };

export type CreateChecklistItemArgs = Pick<
  ChecklistItem,
  'label' | 'cardId' | 'checklistId' | 'listId'
>;

export type UpdateChecklistItemArgs = Pick<
  ChecklistItem,
  'id' | 'isCompleted' | 'label' | 'cardId' | 'checklistId'
>;

export type DeleteChecklistItemArgs = Pick<ChecklistItem, 'id' | 'checklistId'>;

export function useGetChecklistItemQuery(args: { id: string }) {
  return useQuery({
    queryKey: queryKeys.checklistItem(args.id),
    queryFn() {
      return getChecklistItemById({
        data: { itemId: args.id },
      });
    },
  });
}

export function useGetChecklistItemsQuery(args: ChecklistItemsArgs) {
  return useQuery({
    queryKey: queryKeys.checklistItems(args.checklistId),
    queryFn() {
      return getChecklistItems({
        data: { checklistId: args.checklistId },
      });
    },
  });
}

export function useCreateChecklistItemMutation() {
  const mutation = useMutation({
    mutationFn({
      label,
      cardId,
      checklistId,
      listId,
    }: CreateChecklistItemArgs) {
      return createChecklistItem({
        data: { label, cardId, checklistId, listId },
      });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<ChecklistItemType[]>(
        queryKeys.checklistItems(variables.checklistId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklistItemMutation() {
  const mutation = useMutation({
    mutationFn({ id, isCompleted, label }: UpdateChecklistItemArgs) {
      return updateChecklistItem({
        data: { itemId: id, isCompleted, label },
      });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<ChecklistItemType[]>(
        queryKeys.checklistItems(variables.checklistId),
        (cache = [] as ChecklistItemType[]) =>
          cache.map((item) => {
            if (item.id === variables.id) {
              return {
                ...item,
                isCompleted: variables.isCompleted,
                label: variables.label,
              };
            }
            return item;
          }),
      );

      queryClient.setQueryData<ChecklistItemType>(
        queryKeys.checklistItem(variables.id),
        (cache = {} as ChecklistItemType) => ({
          ...cache,
          isCompleted: variables.isCompleted,
          label: variables.label,
        }),
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklistItemMutation() {
  const mutation = useMutation({
    mutationFn({ id }: DeleteChecklistItemArgs) {
      return deleteChecklistItem({
        data: { itemId: id },
      });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<ChecklistItemType[]>(
        queryKeys.checklistItems(variables.id),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return mutation.mutate;
}

export const reorderChecklistItems = (
  item: ChecklistItemType,
  checklistId: string,
  droppedId: string,
) =>
  queryClient.setQueryData<ChecklistItemType[]>(
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
