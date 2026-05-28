import { useAuth } from '@clerk/tanstack-react-start';
import type { Card } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createCard,
  deleteCard,
  getCardById,
  getCards,
  updateCard,
} from '~/db/cards';
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
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.cards(args.listId),
    queryFn: () =>
      getCards({ data: { listId: args.listId, userId: userId ?? '' } }),
  });
}

export function useGetCardByIdQuery(args: { id: string }) {
  const { userId } = useAuth();
  return useQuery({
    queryKey: queryKeys.card(args.id),
    queryFn: () =>
      getCardById({ data: { cardId: args.id, userId: userId ?? '' } }),
  });
}

export function useCreateCardMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ cardTitle, listId }: CreateCardArgs) =>
      createCard({ data: { userId: userId ?? '', cardTitle, listId } }),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<CardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useUpdateCardMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id, cardDescription, cardTitle }: UpdateCardArgs) =>
      updateCard({
        data: {
          cardId: id,
          userId: userId ?? '',
          cardDescription,
          cardTitle,
        },
      }),
    onSuccess: (_result, variables) => {
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

  return [mutation.mutate] as const;
}

export function useDeleteCardMutation() {
  const { userId } = useAuth();
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteCardArgs) =>
      deleteCard({ data: { cardId: id, userId: userId ?? '' } }),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<CardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}

export const reorderCards = (
  item: CardType,
  listId: string,
  droppedId: string,
) =>
  queryClient.setQueryData<CardType[]>(
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
