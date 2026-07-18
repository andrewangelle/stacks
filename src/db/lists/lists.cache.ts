import type { QueryKey } from '@tanstack/react-query';
import {
  type getLists,
  reorderLists as reorderListsServer,
} from '~/db/lists/lists.functions';
import { listQueryKeys } from '~/db/lists/lists.query';
import type { MoveListArgs } from '~/db/lists/lists.schemas';
import type { Card, List } from '~/generated/prisma/client';
import { queryClient } from '~/query';

type BoardPageLists = Awaited<ReturnType<typeof getLists>>;

export type ListCardItem = Pick<Card, 'id' | 'cardTitle' | 'createdAt'>;

export type ListItem = Pick<
  List,
  'id' | 'listTitle' | 'createdAt' | 'position' | 'boardId'
> & {
  cards: ListCardItem[];
};

export type ListCacheSnapshot = [QueryKey, ListItem[] | undefined][];

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
  queryClient.setQueriesData<BoardPageLists>({ queryKey: ['lists'] }, (lists) =>
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
  const lists = queryClient.getQueryData<BoardPageLists>(
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

export function reorderDraggedList(
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

function boardIdsMatch(a: string, b: string) {
  return a.startsWith(b) || b.startsWith(a);
}

function findListInCaches(listId: string) {
  const caches = queryClient.getQueriesData<ListItem[]>({
    queryKey: ['lists'],
  });

  for (const [, lists] of caches) {
    const list = lists?.find((item) => item.id === listId);

    if (list) {
      return list;
    }
  }

  return undefined;
}

export function updateMovedListCache({
  listId,
  targetBoardId,
  targetIndex,
}: MoveListArgs): ListCacheSnapshot {
  const snapshot = queryClient.getQueriesData<ListItem[]>({
    queryKey: ['lists'],
  });

  const movedList = findListInCaches(listId);

  if (!movedList) {
    return snapshot;
  }

  const sourceBoardId = movedList.boardId;

  for (const [key, cache] of snapshot) {
    if (!cache) {
      continue;
    }

    const cacheBoardId = String(key[1] ?? '');
    const isSource = boardIdsMatch(cacheBoardId, sourceBoardId);
    const isTarget = boardIdsMatch(cacheBoardId, targetBoardId);

    if (!isSource && !isTarget) {
      continue;
    }

    const withoutMoved = cache.filter((list) => list.id !== listId);

    if (isTarget) {
      const index = Math.min(Math.max(targetIndex, 0), withoutMoved.length);
      withoutMoved.splice(index, 0, { ...movedList, boardId: targetBoardId });
    }

    queryClient.setQueryData<ListItem[]>(
      key,
      withoutMoved.map((list, position) => ({ ...list, position })),
    );
  }

  return snapshot;
}

export function rollbackListCaches(snapshot: ListCacheSnapshot) {
  for (const [key, data] of snapshot) {
    queryClient.setQueryData(key, data);
  }
}
