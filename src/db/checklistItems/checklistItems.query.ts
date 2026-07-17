import { useMutation, useQuery } from '@tanstack/react-query';
import {
  invalidateCardChecklistView,
  patchChecklistItems,
} from '~/db/checklistItems/checklistItems.cache';
import {
  createChecklistItem,
  deleteChecklistItem,
  updateChecklistItem,
} from '~/db/checklistItems/checklistItems.functions';
import type {
  CreateChecklistItemArgs,
  DeleteChecklistItemArgs,
  GetChecklistItemByIdArgs,
  GetChecklistItemsArgs,
  UpdateChecklistItemArgs,
} from '~/db/checklistItems/checklistItems.schemas';
import {
  checklistByIdQueryOptions,
  checklistQueryKeys,
} from '~/db/checklists/checklists.query';
import type { ChecklistItem } from '~/generated/prisma/client';
import { queryClient } from '~/query';

export function useGetChecklistItem(data: GetChecklistItemByIdArgs) {
  return useQuery({
    ...checklistByIdQueryOptions({ checklistId: data.checklistId }),
    select(response) {
      return response?.items?.find((item) => item.id === data.itemId);
    },
  });
}

export function useGetChecklistItems(data: GetChecklistItemsArgs) {
  return useQuery({
    ...checklistByIdQueryOptions({ checklistId: data.checklistId }),
    select(response) {
      return response?.items ?? [];
    },
  });
}

export function useCreateChecklistItem() {
  const mutation = useMutation({
    mutationFn(data: CreateChecklistItemArgs) {
      return createChecklistItem({
        data,
      });
    },

    onMutate(variables) {
      patchChecklistItems(variables.checklistId, (items) => {
        return [...items, { ...variables, id: 'placeholder' } as ChecklistItem];
      });
    },

    onSuccess(result, variables) {
      const [created] = result.data;

      patchChecklistItems(variables.checklistId, (items) => [
        ...items.map((item) => {
          if (item.id === 'placeholder') {
            return created;
          }
          return item;
        }),
      ]);

      invalidateCardChecklistView(variables.cardId);
    },

    onError(_, variables) {
      queryClient.invalidateQueries({
        queryKey: checklistQueryKeys.detail(variables.checklistId),
      });
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklistItem({
  checklistId,
}: {
  checklistId: string;
}) {
  return useMutation({
    mutationFn(data: UpdateChecklistItemArgs) {
      return updateChecklistItem({
        data,
      });
    },

    onMutate(variables) {
      patchChecklistItems(checklistId, (cache) =>
        cache.map((item) => {
          if (item.id === variables.itemId) {
            return { ...item, ...variables };
          }
          return item;
        }),
      );
    },

    onSuccess(result) {
      const [{ cardId }] = result;
      invalidateCardChecklistView(cardId);
    },

    onError() {
      queryClient.invalidateQueries({
        queryKey: checklistQueryKeys.detail(checklistId),
      });
    },
  });
}

export function useDeleteChecklistItem({
  checklistId,
}: {
  checklistId: string;
}) {
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistItemArgs) {
      return deleteChecklistItem({
        data,
      });
    },

    onMutate(variables) {
      patchChecklistItems(checklistId, (cache) =>
        cache.filter((item) => item.id !== variables.itemId),
      );
    },

    onSuccess(result) {
      const [{ cardId }] = result.data;
      invalidateCardChecklistView(cardId);
    },

    onError() {
      queryClient.invalidateQueries({
        queryKey: checklistQueryKeys.detail(checklistId),
      });
    },
  });

  return mutation.mutate;
}
