import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { setCardChecklistExpanded } from '~/db/cards/cards.functions';
import type { SetCardChecklistExpandedArgs } from '~/db/cards/cards.schemas';
import { invalidateCardChecklistView } from '~/db/checklists/checklists.cache';
import {
  createChecklist,
  deleteChecklist,
  getCardTitleDetailsChecklists,
  getChecklistById,
  getChecklists,
  updateChecklist,
} from '~/db/checklists/checklists.functions';
import type {
  CreateChecklistArgs,
  DeleteChecklistArgs,
  GetChecklistByIdArgs,
  GetChecklistsArgs,
  UpdateChecklistArgs,
} from '~/db/checklists/checklists.schemas';
import type { Checklist } from '~/generated/prisma/client';
import { queryClient } from '~/query';
export type ChecklistItem = Pick<
  Checklist,
  'id' | 'checklistTitle' | 'createdAt'
>;

function toChecklistItem(item: Checklist): ChecklistItem {
  return {
    id: item.id,
    checklistTitle: item.checklistTitle,
    createdAt: item.createdAt,
  };
}

const queryKeys = {
  list: (cardId: string) => ['checklists', cardId] as const,
  detail: (checklistId: string) => ['checklist', checklistId] as const,
  cardChecklistView: (cardId: string) => ['cardChecklistView', cardId] as const,
};

export const checklistQueryKeys = queryKeys;

export function checklistByIdQueryOptions(data: GetChecklistByIdArgs) {
  return {
    queryKey: queryKeys.detail(data.checklistId),
    queryFn() {
      return getChecklistById({
        data,
      });
    },
  };
}

export function checklistsQueryOptions(cardId: string) {
  return {
    queryKey: queryKeys.list(cardId),
    queryFn() {
      return getChecklists({
        data: { cardId },
      });
    },
  };
}

export function cardTitleDetailsChecklistsQueryOptions(cardId: string) {
  return {
    queryKey: queryKeys.cardChecklistView(cardId),
    queryFn() {
      return getCardTitleDetailsChecklists({
        data: { cardId },
      });
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
      queryClient.setQueryData<ChecklistItem[]>(
        queryKeys.list(variables.cardId),
        (cache = []) => [...cache, toChecklistItem(result.data[0])],
      );
      invalidateCardChecklistView(variables.cardId);
    },
  });

  return mutation.mutate;
}

export function useDeleteChecklist() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistArgs) {
      return deleteChecklist({
        data,
      });
    },

    onSuccess(_result, variables) {
      queryClient.setQueryData<ChecklistItem[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.filter((item) => item.id !== variables.checklistId),
      );
      queryClient.removeQueries({
        queryKey: queryKeys.detail(variables.checklistId),
      });
      invalidateCardChecklistView(variables.cardId);
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklist() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(data: UpdateChecklistArgs) {
      return updateChecklist({
        data,
      });
    },

    onSuccess(_result, variables) {
      const patch: Partial<Checklist> = {};

      if (variables.checklistTitle !== undefined) {
        patch.checklistTitle = variables.checklistTitle;
      }

      if (variables.hideCheckedItems !== undefined) {
        patch.hideCheckedItems = variables.hideCheckedItems;
      }

      queryClient.setQueryData<Checklist>(
        queryKeys.detail(variables.checklistId),
        (cache = {} as Checklist) => ({
          ...cache,
          ...patch,
        }),
      );

      queryClient.setQueryData<Checklist[]>(
        queryKeys.list(variables.cardId),
        (cache = []) =>
          cache.map((item) =>
            item.id === variables.checklistId ? { ...item, ...patch } : item,
          ),
      );
    },
  });
}

export function useGetCardTitleDetailsChecklists(data: GetChecklistsArgs) {
  return useSuspenseQuery({
    ...cardTitleDetailsChecklistsQueryOptions(data.cardId),
    select(data) {
      const checklistsWithIncompleteItems = data.checklists.filter(
        (checklist) => checklist.completedItems < checklist.totalItems,
      );
      return {
        isChecklistsExpanded: data.isChecklistsExpanded,
        expandedChecklistId: data.expandedChecklistId,
        completedItemsForCard: data.completedItemsForCard,
        totalItemsForCard: data.totalItemsForCard,
        checklists: checklistsWithIncompleteItems,
        isAllCompleted: data.completedItemsForCard === data.totalItemsForCard,
        hasMultiple: checklistsWithIncompleteItems.length > 1,
        singleChecklistId: checklistsWithIncompleteItems[0]?.id,
      };
    },
  });
}

type CardChecklistView = Awaited<
  ReturnType<typeof getCardTitleDetailsChecklists>
>;

/**
 * Persist the card-title-details checklist expansion to the server: whether the
 * whole checklist view is expanded (`isChecklistsExpanded`) and which single
 * checklist accordion is open (`expandedChecklistId`). Optimistically patches
 * the card checklist view cache so the UI updates instantly.
 */
export function useSetCardChecklistExpanded() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn(data: SetCardChecklistExpandedArgs) {
      return setCardChecklistExpanded({ data });
    },
    onMutate(variables) {
      queryClient.setQueryData<CardChecklistView>(
        queryKeys.cardChecklistView(variables.cardId),
        (cache) => {
          if (!cache) {
            return cache;
          }
          return {
            ...cache,
            isChecklistsExpanded:
              variables.isChecklistsExpanded ?? cache.isChecklistsExpanded,
            expandedChecklistId:
              variables.expandedChecklistId !== undefined
                ? variables.expandedChecklistId
                : cache.expandedChecklistId,
          };
        },
      );
    },
    onError(_error, variables) {
      invalidateCardChecklistView(variables.cardId);
    },
  });
}
