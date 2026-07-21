import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { invalidateActivitiesCache } from '~/db/activity/activity.cache';
import {
  type BoardsPayload,
  findCard,
  getBoardsCache,
  invalidateBoardsCache,
  patchCard,
  patchListCards,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import {
  createCard,
  deleteCard,
  moveCard,
  updateCard,
} from '~/db/cards/cards.functions';
import type {
  CreateCardArgs,
  DeleteCardArgs,
  MoveCardArgs,
  UpdateCardArgs,
} from '~/db/cards/cards.schemas';
import { toListCardItem } from '~/db/lists/lists.query';

export function cardByIdQueryOptions(cardId: string) {
  return {
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findCard(boards, cardId);
    },
  };
}

export function useGetCardById(args: { id: string }) {
  return useSuspenseQuery(cardByIdQueryOptions(args.id));
}

/** The card front the board page renders, plus the id of its owning list. */
export function useGetCard(args: { id: string }) {
  return useSuspenseQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      const card = findCard(boards, args.id);
      return card
        ? { ...toListCardItem(card), listId: card.listId }
        : undefined;
    },
  });
}

export function useCreateCard() {
  return useMutation({
    mutationFn({ cardTitle, listId, position }: CreateCardArgs) {
      return createCard({ data: { cardTitle, listId, position } });
    },

    onSuccess(result, variables) {
      const newCard = {
        ...result.data[0],
        checklists: [],
        _count: { activities: 0 },
      };

      patchListCards(variables.listId, (cards) => {
        if (variables.position === undefined) {
          return [...cards, newCard];
        }

        const next = [...cards];
        const index = Math.min(Math.max(variables.position, 0), next.length);
        next.splice(index, 0, newCard);
        return next;
      });
    },
  });
}

export function useUpdateCard() {
  const mutation = useMutation({
    mutationFn(data: UpdateCardArgs) {
      return updateCard({
        data,
      });
    },

    onMutate(variables) {
      const snapshot = getBoardsCache();

      patchCard(variables.cardId, (card) => ({
        ...card,
        cardTitle: variables.cardTitle ?? card.cardTitle,
        cardDescription: variables.cardDescription ?? card.cardDescription,
        isCompleted: variables.isCompleted ?? card.isCompleted,
      }));

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });

  return mutation.mutate;
}

/**
 * Move a card to another list, possibly on another board. The server rewrites
 * positions and records board transfers in the card's activity feed, so one
 * refetch of the boards tree picks up everything it changed, except the new
 * feed entries, which live in the card's own activity cache.
 */
export function useMoveCardMutation() {
  return useMutation({
    mutationFn({
      sourceBoardId: _sourceBoardId,
      targetBoardId: _targetBoardId,
      ...data
    }: MoveCardArgs & { sourceBoardId: string; targetBoardId: string }) {
      return moveCard({ data });
    },
    onSuccess(_result, variables) {
      invalidateBoardsCache();
      invalidateActivitiesCache(variables.cardId);
    },
  });
}

export function useDeleteCard() {
  const mutation = useMutation({
    mutationFn(data: DeleteCardArgs) {
      return deleteCard({ data });
    },
    onSuccess(_result, variables) {
      patchListCards(variables.listId, (cards) =>
        cards.filter((card) => card.id !== variables.cardId),
      );
    },
  });

  return mutation.mutate;
}
