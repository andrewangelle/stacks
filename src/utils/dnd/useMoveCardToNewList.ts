import { useRef } from 'react';
import type { CrossGroupMoveArgs } from '~/components/Draggable';
import { applyMoveCard } from '~/query/cards';
import { afterCrossContainerDrop } from '~/utils/dnd/crossContainerDragDom';

export function useMoveCardToNewList() {
  // Ref on the card stack only (not the whole column). On cross-container drop the
  // dragged card's onMove runs in *this* list's Draggable — only the source list has
  // the correct container ref for reverting DOM before we update React Query.
  const ref = useRef<HTMLDivElement>(null);

  function moveCardToNewList(args: CrossGroupMoveArgs) {
    afterCrossContainerDrop({
      element: args.element,
      sourceContainer: ref.current,
      fromIndex: args.fromIndex,
      applyMove() {
        applyMoveCard({
          cardId: args.itemId,
          sourceListId: args.sourceGroupId,
          targetListId: args.targetGroupId,
          targetIndex: args.toIndex,
        });
      },
    });
  }

  return {
    ref,
    moveCardToNewList,
  };
}
