import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import {
  createCard,
  deleteCard,
  getCardById,
  getCardsByListId,
  moveCard as moveCardServer,
  reorderCards as reorderCardsServer,
  updateCard,
} from '~/db/cards/cards.functions';
import type {
  CreateCardArgs,
  DeleteCardArgs,
  GetCardsByListIdArgs,
  UpdateCardArgs,
} from '~/db/cards/cards.schemas';
import type { Card } from '~/generated/prisma/client';
import { getQueryClient } from '~/query';

export type CardListItem = Pick<Card, 'id' | 'cardTitle' | 'createdAt'>;
type ListCacheItem = { id: string; cards: CardListItem[] };

function toCardListItem(item: Card): CardListItem {
  return { id: item.id, cardTitle: item.cardTitle, createdAt: item.createdAt };
}

// List cards are rendered from the full-lists caches (`['lists', boardId]` and
// each `['list', listId]` detail selector), so optimistic card moves must patch
// every list-array cache, not just the per-list `['cards', listId]` cache that
// only backs the header count.
const listArrayCacheKeys = [['lists'], ['list']] as const;

function updateListArrayCaches(
  queryClient: QueryClient,
  updater: (lists: ListCacheItem[]) => ListCacheItem[],
) {
  for (const queryKey of listArrayCacheKeys) {
    queryClient.setQueriesData<ListCacheItem[]>({ queryKey }, (cache) =>
      cache ? updater(cache) : cache,
    );
  }
}

function invalidateListArrayCaches(queryClient: QueryClient) {
  for (const queryKey of listArrayCacheKeys) {
    queryClient.invalidateQueries({ queryKey });
  }
}

function findCardInListCaches(
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

export const queryKeys = {
  list: (listId: string) => ['cards', listId] as const,
  detail: (cardId: string) => ['card', cardId] as const,
};

export function cardsByListIdQueryOptions(listId: string) {
  return {
    queryKey: queryKeys.list(listId),
    queryFn() {
      return getCardsByListId({ data: { listId } });
    },
  };
}

export function useGetCardsByListId(data: GetCardsByListIdArgs) {
  return useQuery(cardsByListIdQueryOptions(data.listId));
}

export function cardByIdQueryOptions(cardId: string) {
  return {
    queryKey: queryKeys.detail(cardId),
    enabled: !!cardId,
    queryFn() {
      return getCardById({ data: { cardId } });
    },
  };
}

export function useGetCard(args: { id: string; listId: string }) {
  return useSuspenseQuery({
    ...cardsByListIdQueryOptions(args.listId),
    queryKey: queryKeys.detail(args.id),
    select(data) {
      return data.find((card) => card.id === args.id);
    },
  });
}

export function useGetCardById(args: { id: string }) {
  return useQuery(cardByIdQueryOptions(args.id));
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn({ cardTitle, listId, position }: CreateCardArgs) {
      return createCard({ data: { cardTitle, listId, position } });
    },

    onSuccess(result, variables) {
      const newItem = toCardListItem(result.data[0]);

      queryClient.setQueryData<CardListItem[]>(
        queryKeys.list(variables.listId),
        (cache = []) => {
          if (variables.position === undefined) {
            return [...cache, newItem];
          }

          const next = [...cache];
          const index = Math.min(Math.max(variables.position, 0), next.length);
          next.splice(index, 0, newItem);
          return next;
        },
      );

      updateListArrayCaches(queryClient, (lists) =>
        lists.map((list) => {
          if (list.id !== variables.listId) {
            return list;
          }

          if (variables.position === undefined) {
            return { ...list, cards: [...list.cards, newItem] };
          }

          const nextCards = [...list.cards];
          const index = Math.min(
            Math.max(variables.position, 0),
            nextCards.length,
          );
          nextCards.splice(index, 0, newItem);
          return { ...list, cards: nextCards };
        }),
      );
    },
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: UpdateCardArgs) {
      return updateCard({
        data,
      });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<Card>(
        queryKeys.detail(variables.cardId),
        (cache = {} as Card) => ({
          ...cache,
          cardDescription: variables.cardDescription ?? cache.cardDescription,
          cardTitle: variables.cardTitle ?? cache.cardTitle,
          isCompleted: variables.isCompleted ?? cache.isCompleted,
        }),
      );

      queryClient.setQueryData<CardListItem[]>(
        queryKeys.list(variables.listId),
        (cache = []) =>
          cache.map((item) => {
            if (item.id === variables.cardId) {
              return {
                ...item,
                cardTitle: variables.cardTitle ?? item.cardTitle,
              };
            }
            return item;
          }),
      );

      if (variables.cardTitle !== undefined) {
        updateListArrayCaches(queryClient, (lists) =>
          lists.map((list) => ({
            ...list,
            cards: list.cards.map((card) =>
              card.id === variables.cardId
                ? { ...card, cardTitle: variables.cardTitle ?? card.cardTitle }
                : card,
            ),
          })),
        );
      }
    },
  });

  return mutation.mutate;
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: DeleteCardArgs) {
      return deleteCard({ data });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<CardListItem[]>(
        queryKeys.list(variables.listId),
        (cache = []) => cache.filter((item) => item.id !== variables.cardId),
      );

      updateListArrayCaches(queryClient, (lists) =>
        lists.map((list) =>
          list.id === variables.listId
            ? {
                ...list,
                cards: list.cards.filter(
                  (card) => card.id !== variables.cardId,
                ),
              }
            : list,
        ),
      );
    },
  });

  return mutation.mutate;
}

export function reorderCardsByIndex(
  listId: string,
  fromIndex: number,
  toIndex: number,
) {
  const queryClient = getQueryClient();
  queryClient.setQueryData<CardListItem[]>(
    queryKeys.list(listId),
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
      .getQueryData<CardListItem[]>(queryKeys.list(listId))
      ?.map((card) => card.id) ?? [];

  reorderCardsServer({ data: { listId, orderedIds } }).catch(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.list(listId) });
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
  const queryClient = getQueryClient();
  const sourceCache =
    queryClient.getQueryData<CardListItem[]>(queryKeys.list(sourceListId)) ??
    [];

  const movedCard =
    sourceCache.find((item) => item.id === cardId) ??
    findCardInListCaches(queryClient, sourceListId, cardId);

  if (!movedCard) {
    return;
  }

  const card = movedCard;

  queryClient.setQueryData<CardListItem[]>(
    queryKeys.list(sourceListId),
    sourceCache.filter((item) => item.id !== cardId),
  );

  queryClient.setQueryData<CardListItem[]>(
    queryKeys.list(targetListId),
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
    queryClient.invalidateQueries({ queryKey: queryKeys.list(sourceListId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.list(targetListId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.detail(cardId) });
    invalidateListArrayCaches(queryClient);
  });
}
