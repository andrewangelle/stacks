import {
  findCard,
  findList,
  getBoardsCache,
  patchListCards,
  restoreBoardsCache,
  setBoardsCache,
} from '~/db/boards/boards.cache';
import {
  moveCard as moveCardServer,
  reorderCards as reorderCardsServer,
} from '~/db/cards/cards.functions';

export function reorderCardsByIndex(
  listId: string,
  fromIndex: number,
  toIndex: number,
) {
  const snapshot = getBoardsCache();

  patchListCards(listId, (cards) => {
    const next = [...cards];
    next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
    return next;
  });

  const boards = getBoardsCache();
  const orderedIds = boards
    ? (findList(boards, listId)?.cards.map((card) => card.id) ?? [])
    : [];

  if (orderedIds.length === 0) {
    return;
  }

  reorderCardsServer({ data: { listId, orderedIds } }).catch(() => {
    restoreBoardsCache(snapshot);
  });
}

/**
 * Optimistic cache update + server persist for a card moving to another list on
 * the same board. Called only after afterCrossContainerDrop has reverted the
 * DOM — do not call directly from dragEnd without that sequence.
 */
export function moveCardToNewList({
  cardId,
  sourceListId,
  targetListId,
  targetIndex,
}: {
  cardId: string;
  sourceListId: string;
  targetListId: string;
  targetIndex: number;
}) {
  const snapshot = getBoardsCache();
  const movedCard = snapshot ? findCard(snapshot, cardId) : undefined;

  if (!movedCard) {
    return;
  }

  setBoardsCache((current) =>
    current.map((board) => ({
      ...board,
      lists: board.lists.map((list) => {
        if (list.id === sourceListId) {
          return {
            ...list,
            cards: list.cards.filter((card) => card.id !== cardId),
          };
        }

        if (list.id === targetListId) {
          const next = [...list.cards];
          const index = Math.min(Math.max(targetIndex, 0), next.length);
          next.splice(index, 0, { ...movedCard, listId: targetListId });
          return { ...list, cards: next };
        }

        return list;
      }),
    })),
  );

  moveCardServer({
    data: { cardId, sourceListId, targetListId, targetIndex },
  }).catch(() => {
    restoreBoardsCache(snapshot);
  });
}
