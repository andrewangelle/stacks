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
import { checklistByIdQueryOptions } from '~/db/checklists/checklists.query';

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

    onSuccess(result, variables) {
      const created = result.data[0];

      patchChecklistItems(variables.checklistId, (items) => [
        ...items,
        created,
      ]);

      invalidateCardChecklistView(variables.cardId);
    },
  });

  return mutation.mutate;
}

export function useUpdateChecklistItem() {
  return useMutation({
    mutationFn(data: UpdateChecklistItemArgs) {
      return updateChecklistItem({
        data,
      });
    },
    onSuccess(result) {
      const updatedItem = result[0];

      if (!updatedItem) {
        return;
      }

      patchChecklistItems(updatedItem.checklistId, (items) =>
        items.map((item) => (item.id === updatedItem.id ? updatedItem : item)),
      );

      invalidateCardChecklistView(updatedItem.cardId);
    },
  });
}

export function useDeleteChecklistItem() {
  const mutation = useMutation({
    mutationFn(data: DeleteChecklistItemArgs) {
      return deleteChecklistItem({
        data,
      });
    },
    onSuccess(result, variables) {
      const deletedItem = result.data[0];

      if (!deletedItem) {
        return;
      }

      patchChecklistItems(deletedItem.checklistId, (items) =>
        items.filter((item) => item.id !== variables.itemId),
      );

      invalidateCardChecklistView(deletedItem.cardId);
    },
  });

  return mutation.mutate;
}
