import { moveCardToNewList } from '~/query/cards';
import { useCrossContainerMove } from '~/utils/useCrossContainerMove';

export function useMoveCardToNewList() {
  return useCrossContainerMove((args) => {
    moveCardToNewList({
      cardId: args.itemId,
      sourceListId: args.sourceGroupId,
      targetListId: args.targetGroupId,
      targetIndex: args.toIndex,
    });
  });
}
