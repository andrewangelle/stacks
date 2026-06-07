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
import type { ChecklistItem } from '~/generated/prisma/client';
import { checklistQueryKeys } from '~/query/checklists';
import { queryClient } from '~/query/queryClient';

const queryKeys = {
  list: (checklistId: string) => ['checklistItems', checklistId] as const,
  detail: (checklistItemId: string) =>
    ['checklistItem', checklistItemId] as const,
};

export const checklistItemQueryKeys = queryKeys;

type CardChecklistViewData = {
  completedItemsForCard: number;
  totalItemsForCard: number;
  checklists: {
    id: string;
    checklistTitle: string;
    completedItems: number;
    totalItems: number;
    titles: string[];
  }[];
};

function extractUpdatedChecklistItem(
  result: ChecklistItem[] | { data: ChecklistItem[] },
) {
  if (Array.isArray(result)) {
    return result[0] as ChecklistItem | undefined;
  }

  if (
    typeof result === 'object' &&
    result !== null &&
    'data' in result &&
    Array.isArray((result as { data?: unknown }).data)
  ) {
    return (result as { data: ChecklistItem[] }).data[0];
  }

  return undefined;
}

function getCachedChecklistItem(itemId: string, checklistId: string) {
  return (
    queryClient.getQueryData<ChecklistItem>(queryKeys.detail(itemId)) ??
    queryClient
      .getQueryData<ChecklistItem[]>(queryKeys.list(checklistId))
      ?.find((cachedItem) => cachedItem.id === itemId)
  );
}

function patchCardChecklistViewOnItemUpdate(item: ChecklistItem) {
  const previousItem = getCachedChecklistItem(item.id, item.checklistId);

  if (!previousItem || previousItem.isCompleted === item.isCompleted) {
    return;
  }

  const delta = item.isCompleted ? 1 : -1;

  queryClient.setQueryData<CardChecklistViewData>(
    checklistQueryKeys.cardChecklistView(item.cardId),
    (cache) => {
      if (!cache) {
        return cache;
      }

      return {
        ...cache,
        completedItemsForCard: cache.completedItemsForCard + delta,
        checklists: cache.checklists.map((checklist) => {
          if (checklist.id !== item.checklistId) {
            return checklist;
          }

          return {
            ...checklist,
            completedItems: checklist.completedItems + delta,
            titles: item.isCompleted
              ? [...checklist.titles, item.label]
              : checklist.titles.filter((title) => title !== item.label),
          };
        }),
      };
    },
  );
}

function invalidateCardChecklistView(cardId: string) {
  queryClient.invalidateQueries({
    queryKey: checklistQueryKeys.cardChecklistView(cardId),
  });
}

function updateChecklistItemCaches(item: ChecklistItem) {
  patchCardChecklistViewOnItemUpdate(item);

  queryClient.setQueryData<ChecklistItem>(queryKeys.detail(item.id), item);

  queryClient.setQueryData<ChecklistItem[]>(
    queryKeys.list(item.checklistId),
    (cache = []) =>
      cache.map((cachedItem) =>
        cachedItem.id === item.id ? item : cachedItem,
      ),
  );

  invalidateCardChecklistView(item.cardId);
}

export function useGetChecklistItem(data: GetChecklistItemByIdArgs) {
  return useQuery({
    queryKey: queryKeys.detail(data.itemId),
    queryFn() {
      return getChecklistItemById({
        data,
      });
    },
  });
}

export function useGetChecklistItems(data: GetChecklistItemsArgs) {
  return useQuery({
    queryKey: queryKeys.list(data.checklistId),
    queryFn() {
      return getChecklistItems({
        data,
      });
    },
  });
}

export function useCreateChecklistItem() {
  const mutation = useMutation({
    mutationFn(data: CreateChecklistItemArgs) {
      return createChecklistItem({
        data,
      });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<ChecklistItem[]>(
        queryKeys.list(variables.checklistId),
        (cache = []) => [...cache, result.data[0]],
      );

      invalidateCardChecklistView(variables.cardId);
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklistItem() {
  const mutation = useMutation({
    mutationFn(data: UpdateChecklistItemArgs) {
      return updateChecklistItem({
        data,
      });
    },
    onSuccess(result, variables) {
      const updatedItem = extractUpdatedChecklistItem(result);

      if (updatedItem) {
        updateChecklistItemCaches(updatedItem);
        return;
      }

      queryClient.setQueryData<ChecklistItem>(
        queryKeys.detail(variables.itemId),
        (cache = {} as ChecklistItem) => ({
          ...cache,
          isCompleted: variables.isCompleted ?? cache.isCompleted,
          label: variables.label ?? cache.label,
        }),
      );

      // Safety net for unexpected server payloads: refresh derived checklist totals.
      queryClient.invalidateQueries({
        queryKey: ['cardChecklistView'],
      });
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklistItem() {
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistItemArgs) {
      return deleteChecklistItem({
        data,
      });
    },
    onSuccess(result, variables) {
      const deletedItem =
        result.data[0] ??
        queryClient.getQueryData<ChecklistItem>(
          queryKeys.detail(variables.itemId),
        );

      const checklistId = deletedItem?.checklistId;

      if (checklistId) {
        queryClient.setQueryData<ChecklistItem[]>(
          queryKeys.list(checklistId),
          (cache = []) => cache.filter((item) => item.id !== variables.itemId),
        );
      }

      if (deletedItem) {
        invalidateCardChecklistView(deletedItem.cardId);
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
    queryKeys.list(checklistId),
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
