import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { activityListQueryOptions } from '~/db/activity/activity.query';
import { toCardListItem, updateListArrayCaches } from '~/db/cards/cards.cache';
import {
  createCard,
  deleteCard,
  getCardById,
  moveCard,
  updateCard,
} from '~/db/cards/cards.functions';
import type {
  CreateCardArgs,
  DeleteCardArgs,
  MoveCardArgs,
  UpdateCardArgs,
} from '~/db/cards/cards.schemas';
import { cardTitleDetailsChecklistsQueryOptions } from '~/db/checklists/checklists.query';
import { listsQueryOptions } from '~/db/lists/lists.query';
import type { Card } from '~/generated/prisma/client';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export const queryKeys = {
  detail: (cardId: string) => ['card', cardId] as const,
};

export const cardsQueryKeys = queryKeys;

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
  return useSuspenseQuery(cardByIdQueryOptions(args.id));
}

/**
 * Read a card out of the board's `['lists', boardId]` cache rather than fetching
 * it. Every card on the board already arrives in that payload, so this saves a
 * `getCardById` round trip per rendered card. Use `useGetCardById` instead when
 * you need fields the list payload doesn't carry. `listId` comes from the owning
 * list, since the cached card rows don't include it.
 */
export function useGetCard(args: { id: string }) {
  const boardId = useCurrentBoardId();

  return useSuspenseQuery({
    ...listsQueryOptions(boardId),
    select(lists) {
      for (const list of lists) {
        const card = list.cards.find((item) => item.id === args.id);

        if (card) {
          return { ...card, listId: list.id };
        }
      }

      return undefined;
    },
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn({ cardTitle, listId, position }: CreateCardArgs) {
      return createCard({ data: { cardTitle, listId, position } });
    },

    onSuccess(result, variables) {
      const newCard = result.data[0];
      const newItem = toCardListItem(newCard);

      // Seed the card detail cache so opening the new card's modal resolves
      // from cache instead of suspending on a fetch.
      queryClient.setQueryData<Card>(
        cardByIdQueryOptions(newCard.id).queryKey,
        newCard,
      );

      // A brand-new card has no checklists yet; seed an empty view so the
      // CardTitleDetails content query resolves immediately too.
      queryClient.setQueryData(
        cardTitleDetailsChecklistsQueryOptions(newCard.id).queryKey,
        { completedItemsForCard: 0, totalItemsForCard: 0, checklists: [] },
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

      if (
        variables.cardTitle !== undefined ||
        variables.isCompleted !== undefined ||
        variables.cardDescription !== undefined
      ) {
        updateListArrayCaches(queryClient, (lists) =>
          lists.map((list) => ({
            ...list,
            cards: list.cards.map((card) => {
              if (card.id === variables.cardId) {
                return {
                  ...card,
                  cardTitle: variables.cardTitle ?? card.cardTitle,
                  cardDescription:
                    variables.cardDescription ?? card.cardDescription,
                  isCompleted: variables.isCompleted ?? card.isCompleted,
                };
              }
              return card;
            }),
          })),
        );
      }
    },
  });

  return mutation.mutate;
}

/**
 * Move a card to another list, possibly on another board. Board transfers are recorded in
 * the card's activity feed server-side (see moveCardQuery). Board ids are only used here to
 * invalidate the affected boards' list caches; the server move is keyed off the lists.
 */
export function useMoveCardMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn({
      sourceBoardId: _sourceBoardId,
      targetBoardId: _targetBoardId,
      ...data
    }: MoveCardArgs & { sourceBoardId: string; targetBoardId: string }) {
      return moveCard({ data });
    },
    onSuccess(_result, variables) {
      queryClient.invalidateQueries({
        queryKey: queryKeys.detail(variables.cardId),
      });
      queryClient.invalidateQueries({
        queryKey: ['lists', variables.sourceBoardId],
      });
      queryClient.invalidateQueries({
        queryKey: ['lists', variables.targetBoardId],
      });
      // The move logs transfer entries server-side; drop the cached feed so it
      // refetches when the card is reopened.
      queryClient.invalidateQueries({
        queryKey: activityListQueryOptions({ cardId: variables.cardId })
          .queryKey,
      });
    },
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: DeleteCardArgs) {
      return deleteCard({ data });
    },
    onSuccess(_result, variables) {
      updateListArrayCaches(queryClient, (lists) =>
        lists.map((list) => {
          if (list.id === variables.listId) {
            return {
              ...list,
              cards: list.cards.filter((card) => card.id !== variables.cardId),
            };
          }
          return list;
        }),
      );
    },
  });

  return mutation.mutate;
}
