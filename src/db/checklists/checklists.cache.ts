import { reorderChecklists as reorderChecklistsServer } from '~/db/checklists/checklists.functions';
import {
  type ChecklistItem,
  checklistQueryKeys,
} from '~/db/checklists/checklists.query';
import { queryClient } from '~/query';

export function invalidateCardChecklistView(cardId: string) {
  queryClient.invalidateQueries({
    queryKey: checklistQueryKeys.cardChecklistView(cardId),
  });
}

export function reorderChecklistsByIndex(
  cardId: string,
  fromIndex: number,
  toIndex: number,
) {
  queryClient.setQueryData<ChecklistItem[]>(
    checklistQueryKeys.list(cardId),
    (cache = []) => {
      const next = [...cache];
      next.splice(toIndex, 0, next.splice(fromIndex, 1)[0]);
      return next;
    },
  );

  const orderedIds =
    queryClient
      .getQueryData<ChecklistItem[]>(checklistQueryKeys.list(cardId))
      ?.map((checklist) => checklist.id) ?? [];

  reorderChecklistsServer({ data: { cardId, orderedIds } })
    .then(() => {
      invalidateCardChecklistView(cardId);
    })
    .catch(() => {
      queryClient.invalidateQueries({
        queryKey: checklistQueryKeys.list(cardId),
      });
      invalidateCardChecklistView(cardId);
    });
}
