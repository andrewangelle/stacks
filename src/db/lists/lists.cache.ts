import {
  type getLists,
  reorderLists as reorderListsServer,
} from '~/db/lists/lists.functions';
import { listQueryKeys } from '~/db/lists/lists.query';
import type { Card, List } from '~/generated/prisma/client';
import { queryClient } from '~/query';

type BoardLists = Awaited<ReturnType<typeof getLists>>;

/**
 * Seeds a card's checklist rollup from the board payload so the card front resolves
 * without its own request. Only read when that per-card query has no data yet; once
 * it exists, checklist edits keep it current and this copy is ignored.
 */
/**
 * Adjusts rather than recounts: `['activity', cardId]` can hold a partial list,
 * because creating a feed entry from the board seeds it without ever fetching.
 */
export function adjustCardCommentCount(cardId: string, delta: number) {
  queryClient.setQueriesData<BoardLists>({ queryKey: ['lists'] }, (lists) =>
    lists?.map((list) => ({
      ...list,
      cards: list.cards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              commentsCount: Math.max(card.commentsCount + delta, 0),
            }
          : card,
      ),
    })),
  );
}

export function findCardChecklistView(boardId: string, cardId: string) {
  const lists = queryClient.getQueryData<BoardLists>(
    listQueryKeys.list(boardId),
  );

  for (const list of lists ?? []) {
    const card = list.cards.find((item) => item.id === cardId);

    if (card) {
      return card.checklistView;
    }
  }

  return undefined;
}

export type ListCardItem = Pick<Card, 'id' | 'cardTitle' | 'createdAt'>;

export type ListItem = Pick<
  List,
  'id' | 'listTitle' | 'createdAt' | 'position' | 'boardId'
> & {
  cards: ListCardItem[];
};

export function toListItem(item: List): ListItem {
  return {
    id: item.id,
    listTitle: item.listTitle,
    createdAt: item.createdAt,
    position: item.position,
    boardId: item.boardId,
    cards: [],
  };
}

export function reorderListsByIndex(
  boardId: string,
  fromIndex: number,
  toIndex: number,
) {
  queryClient.setQueryData<ListItem[]>(
    listQueryKeys.list(boardId),
    (cache = []) => {
      const next = [...cache];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    },
  );

  const orderedIds =
    queryClient
      .getQueryData<ListItem[]>(listQueryKeys.list(boardId))
      ?.map((list) => list.id) ?? [];

  reorderListsServer({ data: { boardId, orderedIds } }).catch(() => {
    queryClient.invalidateQueries({ queryKey: listQueryKeys.list(boardId) });
  });
}
