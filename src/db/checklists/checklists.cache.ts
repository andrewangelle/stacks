import {
  findCard,
  getBoardsCache,
  patchCardChecklists,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';
import { reorderChecklists as reorderChecklistsServer } from '~/db/checklists/checklists.functions';

export function reorderChecklistsByIndex(
  cardId: string,
  fromIndex: number,
  toIndex: number,
) {
  const snapshot = getBoardsCache();

  patchCardChecklists(cardId, (checklists) => {
    const next = [...checklists];
    next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
    return next;
  });

  const boards = getBoardsCache();
  const orderedIds = boards
    ? (findCard(boards, cardId)?.checklists.map((checklist) => checklist.id) ??
      [])
    : [];

  if (orderedIds.length === 0) {
    return;
  }

  reorderChecklistsServer({ data: { cardId, orderedIds } }).catch(() => {
    restoreBoardsCache(snapshot);
  });
}

/**
 * The card checklist "view" is the rollup the card front renders: per-checklist
 * completion stats plus card-level totals, derived from a card in the boards
 * tree. Pure and structural, so it accepts any card shape carrying checklists
 * with their items.
 */
export type CardChecklistViewSource = {
  isChecklistsExpanded: boolean;
  expandedChecklistId: string | null;
  checklists: {
    id: string;
    checklistTitle: string;
    items: { label: string; isCompleted: boolean }[];
  }[];
};

export function toCardChecklistView(card: CardChecklistViewSource) {
  let completedItemsForCard = 0;
  let totalItemsForCard = 0;

  const checklistsWithStats = card.checklists.map((checklist) => {
    const completedItems = checklist.items.filter((item) => item.isCompleted);
    const totalItems = checklist.items.length;

    completedItemsForCard += completedItems.length;
    totalItemsForCard += totalItems;

    return {
      id: checklist.id,
      checklistTitle: checklist.checklistTitle,
      completedItems: completedItems.length,
      totalItems,
      titles: completedItems.map((item) => item.label),
    };
  });

  return {
    isChecklistsExpanded: card.isChecklistsExpanded,
    expandedChecklistId: card.expandedChecklistId,
    completedItemsForCard,
    totalItemsForCard,
    checklists: checklistsWithStats.filter(
      (checklist) => checklist.totalItems > 0,
    ),
  };
}
