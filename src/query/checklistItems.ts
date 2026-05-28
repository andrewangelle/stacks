import { useAuth } from '@clerk/tanstack-react-start';
import type { ChecklistItem } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklistItemById,
  getChecklistItems,
  updateChecklistItem,
} from '~/db/checklistItems';
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
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.checklistItem(args.id),
    queryFn: () =>
      getChecklistItemById({
        data: { itemId: args.id, userId: userId ?? '' },
      }),
  });
}

export function useGetChecklistItemsQuery(args: ChecklistItemsArgs) {
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.checklistItems(args.checklistId),
    queryFn: () =>
      getChecklistItems({
        data: { checklistId: args.checklistId, userId: userId ?? '' },
      }),
  });
}

export function useCreateChecklistItemMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({
      label,
      cardId,
      checklistId,
      listId,
    }: CreateChecklistItemArgs) =>
      createChecklistItem({
        data: { label, cardId, checklistId, listId, userId: userId ?? '' },
      }),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<ChecklistItemType[]>(
        queryKeys.checklistItems(variables.checklistId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useUpdateChecklistItemMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id, isCompleted, label }: UpdateChecklistItemArgs) =>
      updateChecklistItem({
        data: { itemId: id, userId: userId ?? '', isCompleted, label },
      }),
    onSuccess: (_result, variables) => {
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

  return [mutation.mutate] as const;
}

export function useDeleteChecklistItemMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteChecklistItemArgs) =>
      deleteChecklistItem({ data: { itemId: id, userId: userId ?? '' } }),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<ChecklistItemType[]>(
        queryKeys.checklistItems(variables.id),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
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
