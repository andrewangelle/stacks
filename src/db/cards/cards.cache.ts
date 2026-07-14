import type { QueryClient } from '@tanstack/react-query';
import { activityListQueryOptions } from '~/db/activity/activity.query';
import {
  moveCard as moveCardServer,
  reorderCards as reorderCardsServer,
} from '~/db/cards/cards.functions';
import { cardByIdQueryOptions, cardsQueryKeys } from '~/db/cards/cards.query';
import {
  checklistByIdQueryOptions,
  checklistsQueryOptions,
} from '~/db/checklists/checklists.query';
import type { Card } from '~/generated/prisma/client';
import { queryClient } from '~/query';

export type CardListItem = Pick<
  Card,
  'id' | 'cardTitle' | 'cardDescription' | 'createdAt' | 'isCompleted'
>;

type ListCacheItem = { id: string; cards: CardListItem[] };

export function toCardListItem(item: Card): CardListItem {
  return {
    id: item.id,
    cardTitle: item.cardTitle,
    createdAt: item.createdAt,
    isCompleted: item.isCompleted,
    cardDescription: item.cardDescription,
  };
}

// Every list-scoped card read (the list body, the header count) selects out of
// the board's `['lists', boardId]` cache, so that is the single cache optimistic
// card writes have to keep true. The filter must stay `['lists']`: `['list']`
// prefix-matches nothing, since react-query compares key segments whole.
const listsCacheKey = ['lists'] as const;

export function updateListArrayCaches(
  queryClient: QueryClient,
  updater: (lists: ListCacheItem[]) => ListCacheItem[],
) {
  queryClient.setQueriesData<ListCacheItem[]>(
    { queryKey: listsCacheKey },
    (cache) => (cache ? updater(cache) : cache),
  );
}

export function invalidateListArrayCaches(queryClient: QueryClient) {
  queryClient.invalidateQueries({ queryKey: listsCacheKey });
}

function getCachedList(queryClient: QueryClient, listId: string) {
  const listCaches = queryClient.getQueriesData<ListCacheItem[]>({
    queryKey: listsCacheKey,
  });

  for (const [, lists] of listCaches) {
    const list = lists?.find((item) => item.id === listId);

    if (list) {
      return list;
    }
  }

  return undefined;
}

export function findCardInListCaches(
  queryClient: QueryClient,
  listId: string,
  cardId: string,
) {
  return getCachedList(queryClient, listId)?.cards.find(
    (item) => item.id === cardId,
  );
}

/** Warms the queries the card modal reads, so opening it resolves from cache. */
export async function prefetchCardModalData(cardId: string) {
  await Promise.all([
    queryClient.prefetchQuery(cardByIdQueryOptions(cardId)),
    queryClient.prefetchQuery(activityListQueryOptions({ cardId })),
  ]);

  const checklists = await queryClient.ensureQueryData(
    checklistsQueryOptions(cardId),
  );

  await Promise.all(
    checklists.map((checklist) =>
      queryClient.prefetchQuery(
        checklistByIdQueryOptions({ checklistId: checklist.id }),
      ),
    ),
  );
}

export function reorderCardsByIndex(
  listId: string,
  fromIndex: number,
  toIndex: number,
) {
  updateListArrayCaches(queryClient, (lists) =>
    lists.map((list) => {
      if (list.id !== listId) {
        return list;
      }

      const nextCards = [...list.cards];
      nextCards.splice(toIndex, 0, nextCards.splice(fromIndex, 1)[0]);
      return { ...list, cards: nextCards };
    }),
  );

  const orderedIds =
    getCachedList(queryClient, listId)?.cards.map((card) => card.id) ?? [];

  if (orderedIds.length === 0) {
    return;
  }

  reorderCardsServer({ data: { listId, orderedIds } }).catch(() => {
    invalidateListArrayCaches(queryClient);
  });
}

/**
 * Optimistic cache update + server persist for a card moving to another list on the
 * same board. Called only after afterCrossContainerDrop has reverted the DOM — do not
 * call directly from dragEnd without that sequence.
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
  const card = findCardInListCaches(queryClient, sourceListId, cardId);

  if (!card) {
    return;
  }

  updateListArrayCaches(queryClient, (lists) =>
    lists.map((list) => {
      if (list.id === sourceListId) {
        return {
          ...list,
          cards: list.cards.filter((sourceCard) => sourceCard.id !== cardId),
        };
      }

      if (list.id === targetListId) {
        const nextCards = [...list.cards];
        const clampedIndex = Math.min(
          Math.max(targetIndex, 0),
          nextCards.length,
        );
        nextCards.splice(clampedIndex, 0, card);
        return { ...list, cards: nextCards };
      }

      return list;
    }),
  );

  moveCardServer({
    data: { cardId, sourceListId, targetListId, targetIndex },
  }).catch(() => {
    queryClient.invalidateQueries({ queryKey: cardsQueryKeys.detail(cardId) });
    invalidateListArrayCaches(queryClient);
  });
}
