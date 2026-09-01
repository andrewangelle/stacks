import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import { invalidateActivitiesCache } from '~/db/activity/activity.cache';
import {
  type BoardsPayload,
  type CardPayload,
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
  setCardDescriptionExpanded,
  updateCard,
} from '~/db/cards/cards.functions';
import type {
  CreateCardArgs,
  DeleteCardArgs,
  MoveCardArgs,
  SetCardDescriptionExpandedArgs,
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

export function useSetDescriptionExpanded() {
  const mutation = useMutation({
    mutationFn(data: SetCardDescriptionExpandedArgs) {
      return setCardDescriptionExpanded({ data });
    },

    onMutate(variables) {
      const snapshot = getBoardsCache();

      patchCard(variables.cardId, (card) => ({
        ...card,
        isDescriptionExpanded: variables.isDescriptionExpanded,
      }));

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });

  return mutation.mutate;
}

export function useCreateCard() {
  return useMutation({
    mutationFn({ cardTitle, listId, position }: CreateCardArgs) {
      return createCard({ data: { cardTitle, listId, position } });
    },

    onSuccess(result, variables) {
      const newCard = {
        ...result,
        checklists: [],
        _count: { activities: 0 },
      } as CardPayload;

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

type MoveCardMutationArgs = MoveCardArgs & {
  sourceBoardId: string;
  targetBoardId: string;
};

export function useMoveCardMutation() {
  return useMutation({
    mutationFn({
      sourceBoardId: _sourceBoardId,
      targetBoardId: _targetBoardId,
      ...data
    }: MoveCardMutationArgs) {
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
