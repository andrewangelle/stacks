import type { Card } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCard,
  deleteCard,
  getCardById,
  getCardsByListId,
  updateCard,
} from '~/db/cards/cards.functions';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';

export type CardType = Omit<Card, 'updatedAt'>;
export type CreateCardArgs = Pick<Card, 'cardTitle' | 'listId'>;
export type UpdateCardArgs = Pick<
  Card,
  'id' | 'cardDescription' | 'cardTitle' | 'listId'
>;
export type DeleteCardArgs = Pick<Card, 'id' | 'listId'>;

export function useGetCardsQuery(args: { listId: string }) {
  return useQuery({
    queryKey: queryKeys.cards(args.listId),
    queryFn() {
      return getCardsByListId({
        data: { listId: args.listId },
      });
    },
  });
}

export function useGetCardByIdQuery(args: { id: string }) {
  return useQuery({
    queryKey: queryKeys.card(args.id),
    queryFn() {
      return getCardById({ data: { cardId: args.id } });
    },
  });
}

export function useCreateCardMutation() {
  const mutation = useMutation({
    mutationFn({ cardTitle, listId }: CreateCardArgs) {
      return createCard({ data: { cardTitle, listId } });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<CardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateCardMutation() {
  const mutation = useMutation({
    mutationFn({ id, cardDescription, cardTitle }: UpdateCardArgs) {
      return updateCard({
        data: {
          cardId: id,
          cardDescription,
          cardTitle,
        },
      });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<CardType>(
        queryKeys.card(variables.id),
        (cache = {} as CardType) => ({
          ...cache,
          cardDescription: variables.cardDescription,
          cardTitle: variables.cardTitle,
        }),
      );
      queryClient.setQueryData<CardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.id
              ? {
                  ...item,
                  cardDescription: variables.cardDescription,
                  cardTitle: variables.cardTitle,
                }
              : item,
          ),
      );
    },
  });

  return mutation.mutate;
}

export function useDeleteCardMutation() {
  const mutation = useMutation({
    mutationFn({ id }: DeleteCardArgs) {
      return deleteCard({ data: { cardId: id } });
    },
    onSuccess(_result, variables) {
      queryClient.setQueryData<CardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return mutation.mutate;
}

export function reorderCards(item: Card, listId: string, droppedId: string) {
  return queryClient.setQueryData<CardType[]>(
    queryKeys.cards(listId),
    (cache = []) => {
      const cacheArray = [...cache];
      const draggedIndex = cacheArray.findIndex(
        (cacheItem) => cacheItem.id === item.id,
      );
      const droppedIndex = cacheArray.findIndex(
        (cacheItem) => cacheItem.id === droppedId,
      );

      cacheArray.splice(droppedIndex, 0, cacheArray.splice(draggedIndex, 1)[0]);

      return cacheArray;
    },
  );
}
