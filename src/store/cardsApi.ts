import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '~/store/queryClient';
import { queryKeys } from '~/store/queryKeys';
import { resourceRequest } from '~/store/resourceClient';

export type ListCardType = {
  id: string;
  created_at: string;
  listId: string;
  userId: string;
  cardTitle: string;
  cardDescription: string;
};

type CardArgs = { listId: string };

type CreateCardArgs = {
  cardTitle: string;
  listId: string;
  token: string;
  userId: string;
};

type UpdateCardArgs = {
  listId: string;
  cardId: string;
  cardDescription: string;
  cardTitle: string;
  token: string;
  userId: string;
};

type DeleteCardArgs = {
  id: string;
  listId: string;
  token: string;
  userId: string;
};

export function useGetCardsQuery(args: CardArgs) {
  return useQuery({
    queryKey: queryKeys.cards(args.listId),
    queryFn: () =>
      resourceRequest<ListCardType[]>('cards', {
        method: 'GET',
        searchParams: { listId: args.listId },
      }),
  });
}

export function useCreateCardMutation() {
  const mutation = useMutation({
    mutationFn: ({ cardTitle, listId, token, userId }: CreateCardArgs) =>
      resourceRequest<{ data: ListCardType[] }>(
        'cards',
        { method: 'POST' },
        {
          cardTitle,
          listId,
          token,
          userId,
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
    mutationFn: ({
      cardId,
      cardDescription,
      cardTitle,
      token,
      userId,
    }: UpdateCardArgs) =>
      resourceRequest<void>(
        `cards/${cardId}`,
        { method: 'PUT' },
        {
          cardDescription,
          cardTitle,
          token,
          userId,
        },
      ),
    onSuccess: (_result, variables) => {
      queryClient.setQueryData<ListCardType[]>(
        queryKeys.cards(variables.listId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.cardId
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
    mutationFn: ({ id, token, userId }: DeleteCardArgs) =>
      resourceRequest<void>(
        `cards/${id}`,
        { method: 'DELETE' },
        {
          id,
          token,
          userId,
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
