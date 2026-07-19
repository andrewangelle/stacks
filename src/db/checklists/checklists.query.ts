import { useMutation, useSuspenseQuery } from '@tanstack/react-query';
import {
  type BoardsPayload,
  findCard,
  findChecklist,
  getBoardsCache,
  patchCard,
  patchCardChecklists,
  patchChecklist,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';
import { boardsQueryOptions } from '~/db/boards/boards.query';
import { setCardChecklistExpanded } from '~/db/cards/cards.functions';
import type { SetCardChecklistExpandedArgs } from '~/db/cards/cards.schemas';
import { toCardChecklistView } from '~/db/checklists/checklists.cache';
import {
  createChecklist,
  deleteChecklist,
  updateChecklist,
} from '~/db/checklists/checklists.functions';
import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
  UpdateChecklistArgs,
} from '~/db/checklists/checklists.schemas';

const emptyChecklistView = toCardChecklistView({
  isChecklistsExpanded: false,
  expandedChecklistId: null,
  checklists: [],
});

export function checklistByIdQueryOptions(data: GetChecklistByIdArgs) {
  return {
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findChecklist(boards, data.checklistId);
    },
  };
}

export function checklistsQueryOptions(cardId: string) {
  return {
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findCard(boards, cardId)?.checklists ?? [];
    },
  };
}

export function useGetChecklist(data: GetChecklistByIdArgs) {
  return useSuspenseQuery(checklistByIdQueryOptions(data));
}

export function useGetChecklists(data: GetChecklistsArgs) {
  return useSuspenseQuery(checklistsQueryOptions(data.cardId));
}

export function useCreateChecklist() {
  const mutation = useMutation({
    mutationFn(data: CreateChecklistArgs) {
      return createChecklist({
        data,
      });
    },

    onSuccess(result, variables) {
      patchCardChecklists(variables.cardId, (checklists) => [
        ...checklists,
        { ...result.data[0], items: [] },
      ]);
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklist() {
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistArgs) {
      return deleteChecklist({
        data,
      });
    },

    onSuccess(_result, variables) {
      patchCardChecklists(variables.cardId, (checklists) =>
        checklists.filter(
          (checklist) => checklist.id !== variables.checklistId,
        ),
      );
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklist() {
  return useMutation({
    mutationFn(data: UpdateChecklistArgs) {
      return updateChecklist({
        data,
      });
    },

    onMutate(variables) {
      const snapshot = getBoardsCache();

      patchChecklist(variables.checklistId, (checklist) => ({
        ...checklist,
        checklistTitle: variables.checklistTitle ?? checklist.checklistTitle,
        hideCheckedItems:
          variables.hideCheckedItems ?? checklist.hideCheckedItems,
      }));

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });
}

/**
 * The card-front checklist rollup, derived straight from the card's checklists
 * in the boards tree — item mutations update it with no extra bookkeeping.
 */
export function useGetCardTitleDetailsChecklists(data: GetChecklistsArgs) {
  return useSuspenseQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      const card = findCard(boards, data.cardId);
      const view = card ? toCardChecklistView(card) : emptyChecklistView;

      const checklistsWithIncompleteItems = view.checklists.filter(
        (checklist) => checklist.completedItems < checklist.totalItems,
      );

      return {
        isChecklistsExpanded: view.isChecklistsExpanded,
        expandedChecklistId: view.expandedChecklistId,
        completedItemsForCard: view.completedItemsForCard,
        totalItemsForCard: view.totalItemsForCard,
        checklists: checklistsWithIncompleteItems,
        isAllCompleted: view.completedItemsForCard === view.totalItemsForCard,
        hasMultiple: checklistsWithIncompleteItems.length > 1,
        singleChecklistId: checklistsWithIncompleteItems[0]?.id,
      };
    },
  });
}

/**
 * Persist the card-title-details checklist expansion to the server: whether the
 * whole checklist view is expanded (`isChecklistsExpanded`) and which single
 * checklist accordion is open (`expandedChecklistId`). Optimistically patches
 * the card in the boards tree so the UI updates instantly.
 */
export function useSetCardChecklistExpanded() {
  return useMutation({
    mutationFn(data: SetCardChecklistExpandedArgs) {
      return setCardChecklistExpanded({ data });
    },
    onMutate(variables) {
      const snapshot = getBoardsCache();

      patchCard(variables.cardId, (card) => ({
        ...card,
        isChecklistsExpanded:
          variables.isChecklistsExpanded ?? card.isChecklistsExpanded,
        expandedChecklistId:
          variables.expandedChecklistId !== undefined
            ? variables.expandedChecklistId
            : card.expandedChecklistId,
      }));

      return { snapshot };
    },
    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });
}
