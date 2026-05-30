import type { Card } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCard,
  deleteCard,
  getCardById,
  getCardsByListId,
  updateCard,
} from '~/db/cards/cards.functions';
import type {
  CreateCardArgs,
  DeleteCardArgs,
  GetCardsByListIdArgs,
  UpdateCardArgs,
} from '~/db/cards/cards.schemas';
import { queryClient } from '~/query/queryClient';

export const queryKeys = {
  list: (listId: string) => ['cards', listId] as const,
  detail: (cardId: string) => ['card', cardId] as const,
};

export function useGetCards(data: GetCardsByListIdArgs) {
  return useQuery({
    queryKey: queryKeys.list(data.listId),
    queryFn() {
      return getCardsByListId({
        data,
      });
    },
  });
}

export function useGetCardById(args: { id: string }) {
  return useQuery({
    queryKey: queryKeys.detail(args.id),
    queryFn() {
      return getCardById({ data: { cardId: args.id } });
    },
  });
}

export function useCreateCard() {
  const mutation = useMutation({
    mutationFn({ cardTitle, listId }: CreateCardArgs) {
      return createCard({ data: { cardTitle, listId } });
    },

    onSuccess(result, variables) {
      queryClient.setQueryData<Card[]>(
        queryKeys.list(variables.listId),
        (cache = []) => [...cache, result.data[0]],
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
        }),
      );

      queryClient.setQueryData<Card[]>(
        queryKeys.list(variables.listId),
        (cache = []) =>
          cache.map((item) => {
            if (item.id === variables.cardId) {
              return {
                ...item,
                cardDescription:
                  variables.cardDescription ?? item.cardDescription,
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
      queryClient.setQueryData<Card[]>(
        queryKeys.list(variables.listId),
        (cache = []) => cache.filter((item) => item.id !== variables.cardId),
      );
    },
  });

  return mutation.mutate;
}

export function reorderCards(item: Card, listId: string, droppedId: string) {
  return queryClient.setQueryData<Card[]>(
    queryKeys.list(listId),
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
