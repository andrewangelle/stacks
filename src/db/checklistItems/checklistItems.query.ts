import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createChecklistItem,
  deleteChecklistItem,
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
import {
  checklistByIdQueryOptions,
  checklistQueryKeys,
} from '~/db/checklists/checklists.query';
import type { Checklist, ChecklistItem } from '~/generated/prisma/client';
import { getQueryClient } from '~/query';

/**
 * Checklist items are not stored under their own query key. They live inside the
 * checklist-by-id cache (`checklistQueryKeys.detail`), which `getChecklistById`
 * populates with a nested `items` array. Reads select out of that cache and every
 * mutation patches the same `items` array so updates reflect immediately without a
 * refetch.
 */
type ChecklistWithItems = Checklist & { items: ChecklistItem[] };

function getCachedChecklistItems(checklistId: string): ChecklistItem[] {
  const queryClient = getQueryClient();
  return (
    queryClient.getQueryData<ChecklistWithItems>(
      checklistQueryKeys.detail(checklistId),
    )?.items ?? []
  );
}

function patchChecklistItems(
  checklistId: string,
  updater: (items: ChecklistItem[]) => ChecklistItem[],
) {
  const queryClient = getQueryClient();
  queryClient.setQueryData<ChecklistWithItems>(
    checklistQueryKeys.detail(checklistId),
    (cache) => {
      if (!cache) {
        return cache;
      }
      return { ...cache, items: updater(cache.items ?? []) };
    },
  );
}

function invalidateCardChecklistView(cardId: string) {
  const queryClient = getQueryClient();
  queryClient.invalidateQueries({
    queryKey: checklistQueryKeys.cardChecklistView(cardId),
  });
}

export function useGetChecklistItem(data: GetChecklistItemByIdArgs) {
  return useQuery({
    ...checklistByIdQueryOptions({ checklistId: data.checklistId }),
    select(response) {
      return response?.items?.find((item) => item.id === data.itemId);
    },
  });
}

export function useGetChecklistItems(data: GetChecklistItemsArgs) {
  return useQuery({
    ...checklistByIdQueryOptions({ checklistId: data.checklistId }),
    select(response) {
      return response?.items ?? [];
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
      const created = result.data[0];

      patchChecklistItems(variables.checklistId, (items) => [
        ...items,
        created,
      ]);

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
    onSuccess(result) {
      const updatedItem = result[0];

      if (!updatedItem) {
        return;
      }

      patchChecklistItems(updatedItem.checklistId, (items) =>
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );

      invalidateCardChecklistView(updatedItem.cardId);
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
      const deletedItem = result.data[0];

      if (!deletedItem) {
        return;
      }

      patchChecklistItems(deletedItem.checklistId, (items) =>
        items.filter((item) => item.id !== variables.itemId),
      );

      invalidateCardChecklistView(deletedItem.cardId);
    },
  });

  return mutation.mutate;
}

export const reorderChecklistItemsByIndex = (
  checklistId: string,
  fromIndex: number,
  toIndex: number,
) => {
  const queryClient = getQueryClient();

  patchChecklistItems(checklistId, (items) => {
    const next = [...items];
    next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
    return next;
  });

  const orderedIds = getCachedChecklistItems(checklistId).map(
    (checklistItem) => checklistItem.id,
  );

  reorderChecklistItemsServer({ data: { checklistId, orderedIds } }).catch(
    () => {
      queryClient.invalidateQueries({
        queryKey: checklistQueryKeys.detail(checklistId),
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
  items: ChecklistItem[];
  visibleItems: ChecklistItem[];
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
  targetItems: ChecklistItem[],
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
  const queryClient = getQueryClient();
  const sourceItems = getCachedChecklistItems(sourceChecklistId);
  const item = sourceItems.find((record) => record.id === itemId);

  if (!item) {
    return;
  }

  const targetItems = getCachedChecklistItems(targetChecklistId);

  const targetChecklist = queryClient.getQueryData<ChecklistWithItems>(
    checklistQueryKeys.detail(targetChecklistId),
  );

  const targetFullIndex = resolveTargetFullIndex(
    targetItems,
    targetVisibleIndex,
    targetChecklist?.hideCheckedItems ?? false,
  );

  const movedItem: ChecklistItem = { ...item, checklistId: targetChecklistId };

  patchChecklistItems(sourceChecklistId, (items) =>
    items.filter((record) => record.id !== itemId),
  );

  patchChecklistItems(targetChecklistId, (items) => {
    const next = [...items];
    const clampedIndex = Math.min(Math.max(targetFullIndex, 0), next.length);
    next.splice(clampedIndex, 0, movedItem);
    return next;
  });

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
        queryKey: checklistQueryKeys.detail(sourceChecklistId),
      });
      queryClient.invalidateQueries({
        queryKey: checklistQueryKeys.detail(targetChecklistId),
      });
      invalidateCardChecklistView(cardId);
    });
}
