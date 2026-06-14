import { useRef } from 'react';
import type { CrossGroupMoveArgs } from '~/components/Draggable';
import { applyMoveChecklistItemToChecklist } from '~/query/checklistItems';
import { afterCrossContainerDrop } from './crossContainerDragDom';

export function useMoveItemToNewChecklist(cardId?: string) {
  // Same role as sortableGroupRef in List.tsx — see crossContainerDragDom.ts.
  const ref = useRef<HTMLDivElement>(null);

  function moveItemToNewChecklist(args: CrossGroupMoveArgs) {
    if (!cardId) {
      return;
    }

    // Checklist items may only move between checklists on the same card.
    // Server enforces that too; client routing is via onMove on the source item.
    afterCrossContainerDrop({
      element: args.element,
      sourceContainer: ref.current,
      fromIndex: args.fromIndex,
      applyMove: () =>
        applyMoveChecklistItemToChecklist({
          itemId: args.itemId,
          sourceChecklistId: args.sourceGroupId,
          targetChecklistId: args.targetGroupId,
          targetVisibleIndex: args.toIndex,
          cardId,
        }),
    });
  }
  return {
    ref,
    moveItemToNewChecklist,
  };
}
