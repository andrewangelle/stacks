import type { Card } from '@prisma/client';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/query/queryClient';
import { queryKeys } from '~/query/queryKeys';
import { resourceRequest } from '~/query/resourceClient';

export type ListCardType = Omit<Card, 'updatedAt'>;
export type CreateCardArgs = Pick<Card, 'cardTitle' | 'listId'>;
export type UpdateCardArgs = Pick<
  Card,
  'id' | 'cardDescription' | 'cardTitle' | 'listId'
>;
export type DeleteCardArgs = Pick<Card, 'id' | 'listId'>;

export function useGetCardsQuery(args: { listId: string }) {
  return useQuery({
    queryKey: queryKeys.cards(args.listId),
    queryFn: () =>
      resourceRequest<ListCardType[]>('cards', {
        method: 'GET',
        searchParams: { listId: args.listId },
      }),
  });
}

export function useGetCardByIdQuery(args: { id: string }) {
  return useQuery({
    queryKey: queryKeys.card(args.id),
    queryFn() {
      return resourceRequest<ListCardType>(`cards/${args.id}`, {
        method: 'GET',
      });
    },
  });
}

export function useCreateCardMutation() {
  const mutation = useMutation({
    mutationFn: ({ cardTitle, listId }: CreateCardArgs) =>
      resourceRequest<{ data: ListCardType[] }>(
        'cards',
        { method: 'POST' },
        {
          cardTitle,
          listId,
        },
      ),
    onSuccess: (result, variables) => {
      queryClient.setQueryData<ListCardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) => [...cache, result.data[0]],
      );
    },
  });

  return [mutation.mutate] as const;
}

export function useUpdateCardMutation() {
  const mutation = useMutation({
    mutationFn: ({ id, cardDescription, cardTitle }: UpdateCardArgs) =>
      resourceRequest<void>(
        `cards/${id}`,
        { method: 'PUT' },
        {
          cardDescription,
          cardTitle,
        },
      ),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<ListCardType>(
        queryKeys.card(variables.id),
        (cache = {} as ListCardType) => ({
          ...cache,
          cardDescription: variables.cardDescription,
          cardTitle: variables.cardTitle,
        }),
      );
      queryClient.setQueryData<ListCardType[]>(
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
  const mutation = useMutation({
    mutationFn: ({ id }: DeleteCardArgs) =>
      resourceRequest<void>(
        `cards/${id}`,
        { method: 'DELETE' },
        {
          id,
        },
      ),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<ListCardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) => cache.filter((item) => item.id !== variables.id),
      );
    },
  });

  return [mutation.mutate] as const;
}

export const reorderCards = (
  item: ListCardType,
  listId: string,
  droppedId: string,
) =>
  queryClient.setQueryData<ListCardType[]>(
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
