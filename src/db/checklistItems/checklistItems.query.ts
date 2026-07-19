import { useMutation, useQuery } from '@tanstack/react-query';
import {
  type BoardsPayload,
  findChecklist,
  getBoardsCache,
  patchChecklistItems,
  restoreBoardsCache,
} from '~/db/boards/boards.cache';
import { boardsQueryOptions } from '~/db/boards/boards.query';
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
import type { ChecklistItem } from '~/generated/prisma/client';

export function useGetChecklistItem(data: GetChecklistItemByIdArgs) {
  return useQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findChecklist(boards, data.checklistId)?.items.find(
        (item) => item.id === data.itemId,
      );
    },
  });
}

export function useGetChecklistItems(data: GetChecklistItemsArgs) {
  return useQuery({
    ...boardsQueryOptions,
    select(boards: BoardsPayload) {
      return findChecklist(boards, data.checklistId)?.items ?? [];
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
      const snapshot = getBoardsCache();

      patchChecklistItems(variables.checklistId, (items) => [
        ...items,
        { ...variables, id: 'placeholder' } as ChecklistItem,
      ]);

      return { snapshot };
    },

    onSuccess(result, variables) {
      const [created] = result.data;

      patchChecklistItems(variables.checklistId, (items) =>
        items.map((item) => (item.id === 'placeholder' ? created : item)),
      );
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
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
      const snapshot = getBoardsCache();

      patchChecklistItems(checklistId, (items) =>
        items.map((item) =>
          item.id === variables.itemId ? { ...item, ...variables } : item,
        ),
      );

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
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
      const snapshot = getBoardsCache();

      patchChecklistItems(checklistId, (items) =>
        items.filter((item) => item.id !== variables.itemId),
      );

      return { snapshot };
    },

    onError(_error, _variables, context) {
      restoreBoardsCache(context?.snapshot);
    },
  });

  return mutation.mutate;
}
