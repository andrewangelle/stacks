import {
  type ChecklistItemPayload,
  findChecklist,
  getBoardsCache,
  patchChecklistItems,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';
import {
  moveChecklistItem as moveChecklistItemServer,
  reorderChecklistItems as reorderChecklistItemsServer,
} from '~/db/checklistItems/checklistItems.functions';

export function getCachedChecklistItems(
  checklistId: string,
): ChecklistItemPayload[] {
  const boards = getBoardsCache();
  return boards ? (findChecklist(boards, checklistId)?.items ?? []) : [];
}

export function reorderChecklistItemsByIndex(
  checklistId: string,
  fromIndex: number,
  toIndex: number,
) {
  const snapshot = getBoardsCache();

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
      restoreBoardsCache(snapshot);
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
  items: ChecklistItemPayload[];
  visibleItems: ChecklistItemPayload[];
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
  targetItems: ChecklistItemPayload[],
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
 * Optimistic cache update + server persist when a checklist item moves to
 * another checklist on the same card. targetVisibleIndex comes from sortable
 * indices, which respect hideCheckedItems in the UI; resolveTargetFullIndex
 * maps that to the full item array order the server stores.
 */
export function moveChecklistItemToNewChecklist({
  itemId,
  sourceChecklistId,
  targetChecklistId,
  targetVisibleIndex,
}: {
  itemId: string;
  sourceChecklistId: string;
  targetChecklistId: string;
  targetVisibleIndex: number;
}) {
  const snapshot = getBoardsCache();
  const sourceItems = getCachedChecklistItems(sourceChecklistId);
  const item = sourceItems.find((record) => record.id === itemId);

  if (!item) {
    return;
  }

  const targetChecklist = snapshot
    ? findChecklist(snapshot, targetChecklistId)
    : undefined;

  const targetFullIndex = resolveTargetFullIndex(
    targetChecklist?.items ?? [],
    targetVisibleIndex,
    targetChecklist?.hideCheckedItems ?? false,
  );

  const movedItem = { ...item, checklistId: targetChecklistId };

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
  }).catch(() => {
    restoreBoardsCache(snapshot);
  });
}
