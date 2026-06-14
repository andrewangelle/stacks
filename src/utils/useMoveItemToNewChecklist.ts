import { moveChecklistItemToNewChecklist } from '~/query/checklistItems';
import { useCrossContainerMove } from '~/utils/useCrossContainerMove';

export function useMoveItemToNewChecklist(cardId?: string) {
  return useCrossContainerMove(
    (args) =>
      cardId &&
      moveChecklistItemToNewChecklist({
        itemId: args.itemId,
        sourceChecklistId: args.sourceGroupId,
        targetChecklistId: args.targetGroupId,
        targetVisibleIndex: args.toIndex,
        cardId,
      }),
  );
}
