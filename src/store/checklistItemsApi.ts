import { useMutation, useQuery } from '@tanstack/react-query';
import type { ChecklistType } from '~/store/checklistsApi';
import { queryClient } from '~/store/queryClient';
import { queryKeys } from '~/store/queryKeys';
import { resourceRequest } from '~/store/resourceClient';

export type ChecklistItemType = {
  id: string;
  created_at: string;
  label: string;
  cardId: string;
  listId: string;
  checklistId: string;
  isCompleted: boolean;
  userId: string;
};

type ChecklistItemsArgs = { checklistId: string };

type CreateChecklistItemArgs = {
  label: string;
  cardId: string;
  checklistId: string;
  listId: string;
};

type UpdateChecklistItemArgs = {
  isCompleted: boolean;
  id: string;
  cardId: string;
  checklistId: string;
  label: string;
};

type DeleteChecklistItemArgs = {
  id: string;
  checklistId: string;
};

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
    mutationFn: ({
      id,
      isCompleted,
      label,
      checklistId,
    }: UpdateChecklistItemArgs) =>
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
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.id
              ? {
                  ...item,
                  isCompleted: variables.isCompleted,
                  label: variables.label,
                }
              : item,
          ),
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
        queryKeys.checklistItems(variables.checklistId),
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
