import { useMutation, useQuery } from '@tanstack/react-query';
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
import { queryClient } from '~/query/queryClient';

export type CardListItem = Pick<Card, 'id' | 'cardTitle' | 'createdAt'>;

function toCardListItem(item: Card): CardListItem {
  return { id: item.id, cardTitle: item.cardTitle, createdAt: item.createdAt };
}

export const queryKeys = {
  list: (listId: string) => ['cards', listId] as const,
  detail: (cardId: string) => ['card', cardId] as const,
};

export function useGetCardsByListId(data: GetCardsByListIdArgs) {
  return useQuery({
    queryKey: queryKeys.list(data.listId),
    queryFn() {
      return getCardsByListId({
        data,
      });
    },
  });
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

export function useGetCardById(args: { id: string }) {
  return useQuery(cardByIdQueryOptions(args.id));
}

export function useCreateCard() {
  const mutation = useMutation({
    mutationFn({ cardTitle, listId }: CreateCardArgs) {
      return createCard({ data: { cardTitle, listId } });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<CardListItem[]>(
        queryKeys.list(variables.listId),
        (cache = []) => [...cache, toCardListItem(result.data[0])],
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateCard() {
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
    },
  });

  return mutation.mutate;
}

export function useDeleteCard() {
  const mutation = useMutation({
    mutationFn(data: DeleteCardArgs) {
      return deleteCard({ data });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<CardListItem[]>(
        queryKeys.list(variables.listId),
        (cache = []) => cache.filter((item) => item.id !== variables.cardId),
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
  queryClient.setQueryData<CardListItem[]>(
    queryKeys.list(listId),
    (cache = []) => {
      const next = [...cache];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    },
  );

  const orderedIds =
    queryClient
      .getQueryData<CardListItem[]>(queryKeys.list(listId))
      ?.map((card) => card.id) ?? [];

  reorderCardsServer({ data: { listId, orderedIds } }).catch(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.list(listId) });
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
    queryClient.getQueryData<CardListItem[]>(queryKeys.list(sourceListId)) ??
    [];

  const card = sourceCache.find((item) => item.id === cardId);

  if (!card) {
    return;
  }

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

  moveCardServer({
    data: { cardId, sourceListId, targetListId, targetIndex },
  }).catch(() => {
    queryClient.invalidateQueries({ queryKey: queryKeys.list(sourceListId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.list(targetListId) });
    queryClient.invalidateQueries({ queryKey: queryKeys.detail(cardId) });
  });
}
