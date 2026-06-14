import { useRef } from 'react';
import type { CrossGroupMoveArgs } from '~/components/Draggable';
import { applyMoveChecklistItemToChecklist } from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { afterCrossContainerDrop } from './crossContainerDragDom';

export function useMoveItemToNewChecklist(checklistId: string) {
  // Same role as sortableGroupRef in List.tsx — see crossContainerDragDom.ts.
  const ref = useRef<HTMLDivElement>(null);
  const { data: checklist } = useGetChecklist({
    checklistId,
  });

  function moveItemToNewChecklist(args: CrossGroupMoveArgs) {
    if (!checklist) {
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
          cardId: checklist.cardId,
        }),
    });
  }
  return {
    ref,
    moveItemToNewChecklist,
  };
}
