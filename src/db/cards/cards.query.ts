import {
  type QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { activityListQueryOptions } from '~/db/activity/activity.query';
import type { CardListItem } from '~/db/cards/cards.cache';
import { toCardListItem, updateListArrayCaches } from '~/db/cards/cards.cache';
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
import {
  checklistByIdQueryOptions,
  checklistsQueryOptions,
} from '~/db/checklists/checklists.query';
import type { Card } from '~/generated/prisma/client';

export const queryKeys = {
  list: (listId: string) => ['cards', listId] as const,
  detail: (cardId: string) => ['card', cardId] as const,
};

export const cardsQueryKeys = queryKeys;

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
  return useSuspenseQuery(cardByIdQueryOptions(args.id));
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
                isCompleted: variables.isCompleted ?? item.isCompleted,
                cardDescription:
                  variables.cardDescription ?? item.cardDescription,
                cardTitle: variables.cardTitle ?? item.cardTitle,
              };
            }
            return item;
          }),
      );

      if (
        variables.cardTitle !== undefined ||
        variables.isCompleted !== undefined ||
        variables.cardDescription !== undefined
      ) {
        updateListArrayCaches(queryClient, (lists) =>
          lists.map((list) => ({
            ...list,
            cards: list.cards.map((card) =>
              card.id === variables.cardId
                ? {
                    ...card,
                    cardTitle: variables.cardTitle ?? card.cardTitle,
                    cardDescription:
                      variables.cardDescription ?? card.cardDescription,
                    isCompleted: variables.isCompleted ?? card.isCompleted,
                  }
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
