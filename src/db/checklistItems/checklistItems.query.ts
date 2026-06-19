import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklistItem,
  deleteChecklistItem,
  getChecklistItemById,
  getChecklistItems,
  moveChecklistItem as moveChecklistItemServer,
  reorderChecklistItems as reorderChecklistItemsServer,
  updateChecklistItem,
} from '~/db/checklistItems/checklistItems.functions';
import type {
  CreateChecklistItemArgs,
  DeleteChecklistItemArgs,
  GetChecklistItemByIdArgs,
  GetChecklistItemsArgs,
  UpdateChecklistItemArgs,
} from '~/db/checklistItems/checklistItems.schemas';
import { checklistQueryKeys } from '~/db/checklists/checklists.query';
import type { Checklist, ChecklistItem } from '~/generated/prisma/client';
import { queryClient } from '~/queryClient';

export type ChecklistItemListItem = Pick<
  ChecklistItem,
  'id' | 'label' | 'isCompleted' | 'createdAt'
>;

function toChecklistItemListItem(item: ChecklistItem): ChecklistItemListItem {
  return {
    id: item.id,
    label: item.label,
    isCompleted: item.isCompleted,
    createdAt: item.createdAt,
  };
}

export const queryKeys = {
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
      .getQueryData<ChecklistItemListItem[]>(queryKeys.list(checklistId))
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

  const listItem = toChecklistItemListItem(item);

  queryClient.setQueryData<ChecklistItemListItem[]>(
    queryKeys.list(item.checklistId),
    (cache = []) =>
      cache.map((cachedItem) =>
        cachedItem.id === item.id ? listItem : cachedItem,
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
      queryClient.setQueryData<ChecklistItemListItem[]>(
        queryKeys.list(variables.checklistId),
        (cache = []) => [...cache, toChecklistItemListItem(result.data[0])],
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

      const checklistId = queryClient.getQueryData<ChecklistItem>(
        queryKeys.detail(variables.itemId),
      )?.checklistId;

      if (checklistId) {
        queryClient.setQueryData<ChecklistItemListItem[]>(
          queryKeys.list(checklistId),
          (cache = []) =>
            cache.map((cachedItem) =>
              cachedItem.id === variables.itemId
                ? {
                    ...cachedItem,
                    isCompleted:
                      variables.isCompleted ?? cachedItem.isCompleted,
                    label: variables.label ?? cachedItem.label,
                  }
                : cachedItem,
            ),
        );
      }

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
        queryClient.setQueryData<ChecklistItemListItem[]>(
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

export const reorderChecklistItemsByIndex = (
  checklistId: string,
  fromIndex: number,
  toIndex: number,
) => {
  queryClient.setQueryData<ChecklistItemListItem[]>(
    queryKeys.list(checklistId),
    (cache = []) => {
      const next = [...cache];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    },
  );

  const orderedIds =
    queryClient
      .getQueryData<ChecklistItemListItem[]>(queryKeys.list(checklistId))
      ?.map((checklistItem) => checklistItem.id) ?? [];

  reorderChecklistItemsServer({ data: { checklistId, orderedIds } }).catch(
    () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.list(checklistId),
      });
    },
  );
};

export function reorderChecklistItemsByVisibleIndex({
  checklistId,
  items,
  visibleItems,
  fromVisible,
  toVisible,
}: {
  checklistId: string;
  items: ChecklistItemListItem[];
  visibleItems: ChecklistItemListItem[];
  fromVisible: number;
  toVisible: number;
}) {
  const fromIndex = items.findIndex(
    (item) => item.id === visibleItems[fromVisible]?.id,
  );
  const toIndex = items.findIndex(
    (item) => item.id === visibleItems[toVisible]?.id,
  );

  if (fromIndex === -1 || toIndex === -1) return;

  reorderChecklistItemsByIndex(checklistId, fromIndex, toIndex);
}

/** Map a drag index from visible-only UI to the full checklist item order in the database. */
function resolveTargetFullIndex(
  targetItems: ChecklistItemListItem[],
  targetVisibleIndex: number,
  hideCheckedItems: boolean,
) {
  if (!hideCheckedItems) {
    return Math.min(Math.max(targetVisibleIndex, 0), targetItems.length);
  }

  const targetVisibleItems = targetItems.filter((item) => !item.isCompleted);

  if (targetVisibleIndex >= targetVisibleItems.length) {
    return targetItems.length;
  }

  const anchorId = targetVisibleItems[targetVisibleIndex]?.id;
  const fullIndex = targetItems.findIndex((item) => item.id === anchorId);

  return fullIndex === -1 ? targetItems.length : fullIndex;
}

/**
 * Optimistic cache update + server persist when a checklist item moves to another
 * checklist on the same card. targetVisibleIndex comes from sortable indices, which
 * respect hideCheckedItems in the UI; resolveTargetFullIndex maps that to the full
 * item array order the server stores.
 */
export function moveChecklistItemToNewChecklist({
  itemId,
  sourceChecklistId,
  targetChecklistId,
  targetVisibleIndex,
  cardId,
}: {
  itemId: string;
  sourceChecklistId: string;
  targetChecklistId: string;
  targetVisibleIndex: number;
  cardId: string;
}) {
  const sourceItems =
    queryClient.getQueryData<ChecklistItemListItem[]>(
      queryKeys.list(sourceChecklistId),
    ) ?? [];
  const item = sourceItems.find((record) => record.id === itemId);

  if (!item) {
    return;
  }

  const targetItems =
    queryClient.getQueryData<ChecklistItemListItem[]>(
      queryKeys.list(targetChecklistId),
    ) ?? [];

  const targetChecklist = queryClient.getQueryData<Checklist>(
    checklistQueryKeys.detail(targetChecklistId),
  );

  const targetFullIndex = resolveTargetFullIndex(
    targetItems,
    targetVisibleIndex,
    targetChecklist?.hideCheckedItems ?? false,
  );

  queryClient.setQueryData<ChecklistItemListItem[]>(
    queryKeys.list(sourceChecklistId),
    sourceItems.filter((record) => record.id !== itemId),
  );

  queryClient.setQueryData<ChecklistItemListItem[]>(
    queryKeys.list(targetChecklistId),
    (cache = []) => {
      const next = [...cache];
      const clampedIndex = Math.min(Math.max(targetFullIndex, 0), next.length);
      next.splice(clampedIndex, 0, item);
      return next;
    },
  );

  moveChecklistItemServer({
    data: {
      itemId,
      sourceChecklistId,
      targetChecklistId,
      targetIndex: targetFullIndex,
    },
  })
    .then(() => {
      // Card title progress badge reads a separate query — refresh after persist,
      // not before, or a refetch can overwrite the optimistic item lists above.
      invalidateCardChecklistView(cardId);
    })
    .catch(() => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.list(sourceChecklistId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.list(targetChecklistId),
      });
      invalidateCardChecklistView(cardId);
    });
}
