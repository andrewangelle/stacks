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

// List cards are rendered from the full-lists caches (`['lists', boardId]` and
// each `['list', listId]` detail selector), so optimistic card moves must patch
// every list-array cache, not just the per-list `['cards', listId]` cache that
// only backs the header count.
const listArrayCacheKeys = [['lists'], ['list']] as const;

export function updateListArrayCaches(
  queryClient: QueryClient,
  updater: (lists: ListCacheItem[]) => ListCacheItem[],
) {
  for (const queryKey of listArrayCacheKeys) {
    queryClient.setQueriesData<ListCacheItem[]>({ queryKey }, (cache) =>
      cache ? updater(cache) : cache,
    );
  }
}

export function invalidateListArrayCaches(queryClient: QueryClient) {
  for (const queryKey of listArrayCacheKeys) {
    queryClient.invalidateQueries({ queryKey });
  }
}

export function findCardInListCaches(
  queryClient: QueryClient,
  listId: string,
  cardId: string,
) {
  const listCaches = queryClient.getQueriesData<ListCacheItem[]>({
    queryKey: ['list'],
  });

  for (const [, lists] of listCaches) {
    const card = lists
      ?.find((list) => list.id === listId)
      ?.cards.find((item) => item.id === cardId);

    if (card) {
      return card;
    }
  }

  return undefined;
}

/** Loader prefetch: card modal queries (detail, checklists, activity). */
export async function prefetchCardModalData(
  queryClient: QueryClient,
  cardId: string,
) {
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
  queryClient.setQueryData<CardListItem[]>(
    cardsQueryKeys.list(listId),
    (cache = []) => {
      const next = [...cache];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    },
  );

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
    queryClient
      .getQueryData<CardListItem[]>(cardsQueryKeys.list(listId))
      ?.map((card) => card.id) ?? [];

  reorderCardsServer({ data: { listId, orderedIds } }).catch(() => {
    queryClient.invalidateQueries({ queryKey: cardsQueryKeys.list(listId) });
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
  const sourceCache =
    queryClient.getQueryData<CardListItem[]>(
      cardsQueryKeys.list(sourceListId),
    ) ?? [];

  const movedCard =
    sourceCache.find((item) => item.id === cardId) ??
    findCardInListCaches(queryClient, sourceListId, cardId);

  if (!movedCard) {
    return;
  }

  const card = movedCard;

  queryClient.setQueryData<CardListItem[]>(
    cardsQueryKeys.list(sourceListId),
    sourceCache.filter((item) => item.id !== cardId),
  );

  queryClient.setQueryData<CardListItem[]>(
    cardsQueryKeys.list(targetListId),
    (cache = []) => {
      const next = [...cache];
      const clampedIndex = Math.min(Math.max(targetIndex, 0), next.length);
      next.splice(clampedIndex, 0, card);
      return next;
    },
  );

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
    queryClient.invalidateQueries({
      queryKey: cardsQueryKeys.list(sourceListId),
    });
    queryClient.invalidateQueries({
      queryKey: cardsQueryKeys.list(targetListId),
    });
    queryClient.invalidateQueries({ queryKey: cardsQueryKeys.detail(cardId) });
    invalidateListArrayCaches(queryClient);
  });
}
