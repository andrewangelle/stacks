import type { ChecklistItem } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { ChecklistType } from '~/query/checklists';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

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
    queryFn: () =>
      resourceRequest<ChecklistItemType>(`checklist-items/${args.id}`, {
        method: 'GET',
      }),
  });
}

export function useGetChecklistItemsQuery(args: ChecklistItemsArgs) {
  return useQuery({
    queryKey: queryKeys.checklistItems(args.checklistId),
    queryFn: () =>
      resourceRequest<ChecklistItemType[]>('checklist-items', {
        method: 'GET',
        searchParams: { checklistId: args.checklistId },
      }),
  });
}

export function useCreateChecklistItemMutation() {
  const mutation = useMutation({
    mutationFn: ({
      label,
      cardId,
      checklistId,
      listId,
    }: CreateChecklistItemArgs) =>
      resourceRequest<{ data: ChecklistItemType[] }>(
        'checklist-items',
        { method: 'POST' },
        {
          label,
          cardId,
          checklistId,
          listId,
        },
      ),
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
  const mutation = useMutation({
    mutationFn: ({ id, isCompleted, label }: UpdateChecklistItemArgs) =>
      resourceRequest<{ data: ChecklistItemType[] }>(
        `checklist-items/${id}`,
        { method: 'PUT' },
        {
          isCompleted,
          label,
        },
      ),
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
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteChecklistItemArgs) =>
      resourceRequest<{ data: ChecklistType[] }>(`checklist-items/${id}`, {
        method: 'DELETE',
      }),
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
