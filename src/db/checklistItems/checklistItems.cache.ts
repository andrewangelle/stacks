import {
  moveChecklistItem as moveChecklistItemServer,
  reorderChecklistItems as reorderChecklistItemsServer,
} from '~/db/checklistItems/checklistItems.functions';
import { checklistQueryKeys } from '~/db/checklists/checklists.query';
import type { Checklist, ChecklistItem } from '~/generated/prisma/client';
import { queryClient } from '~/query';

/**
 * Checklist items are not stored under their own query key. They live inside the
 * checklist-by-id cache (`checklistQueryKeys.detail`), which `getChecklistById`
 * populates with a nested `items` array. Reads select out of that cache and every
 * mutation patches the same `items` array so updates reflect immediately without a
 * refetch.
 */
type ChecklistWithItems = Checklist & { items: ChecklistItem[] };

export function getCachedChecklistItems(checklistId: string): ChecklistItem[] {
  return (
    queryClient.getQueryData<ChecklistWithItems>(
      checklistQueryKeys.detail(checklistId),
    )?.items ?? []
  );
}

export function patchChecklistItems(
  checklistId: string,
  updater: (items: ChecklistItem[]) => ChecklistItem[],
) {
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

export function invalidateCardChecklistView(cardId: string) {
  queryClient.invalidateQueries({
    queryKey: checklistQueryKeys.cardChecklistView(cardId),
  });
}

export function reorderChecklistItemsByIndex(
  checklistId: string,
  fromIndex: number,
  toIndex: number,
) {
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
}

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
export function resolveTargetFullIndex(
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
