import { useEffect, useRef } from 'react';
import { AddChecklistItem } from '~/components/ChecklistItem/AddChecklistItem';
import { ChecklistItem } from '~/components/ChecklistItem/ChecklistItem';
import { ChecklistEditableTitle } from '~/components/Checklists/ChecklistEditableTitle';
import { ChecklistProgress } from '~/components/Checklists/ChecklistProgress';
import { ChecklistSkeleton } from '~/components/Checklists/ChecklistSkeleton';
import {
  AllItemsCompleteMessage,
  ChecklistContainer,
  ChecklistHeader,
  ChecklistHeaderActions,
} from '~/components/Checklists/Checklists.styled';
import { DeleteChecklist } from '~/components/Checklists/DeleteChecklist';
import { ToggleCheckedItems } from '~/components/Checklists/ToggleCheckedItems';
import { type CrossGroupMoveArgs, Draggable } from '~/components/Draggable';
import { DropZone } from '~/components/DropZone';
import {
  applyMoveChecklistItemToChecklist,
  reorderChecklistItemsByVisibleIndex,
  useGetChecklistItems,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { afterCrossContainerDrop } from '~/utils/crossContainerDragDom';
import { useHashChecklistId } from '~/utils/useHashChecklistId';

export function Checklist({ id }: { id: string }) {
  // Same role as sortableGroupRef in List.tsx — see crossContainerDragDom.ts.
  const sortableGroupRef = useRef<HTMLDivElement>(null);
  const {
    isLoading,
    isSuccess,
    data: checklist,
  } = useGetChecklist({
    checklistId: id,
  });
  const { isSuccess: isItemsSuccess, data: items } = useGetChecklistItems({
    checklistId: id,
  });
  const hashId = useHashChecklistId();
  const headerRef = useRef<HTMLDivElement>(null);

  const hideCheckedItems = checklist?.hideCheckedItems ?? false;
  const visibleItems = hideCheckedItems
    ? items?.filter((item) => !item.isCompleted)
    : items;
  const showAllItemsCompleteMessage =
    hideCheckedItems && (items?.length ?? 0) > 0 && visibleItems?.length === 0;

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (hashId === id && isItemsSuccess && isSuccess) {
      timeoutId = setTimeout(() => {
        headerRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }

    return () => clearTimeout(timeoutId);
  }, [hashId, id, isSuccess, isItemsSuccess]);

  if (isLoading) {
    return <ChecklistSkeleton />;
  }

  return (
    <ChecklistContainer data-testid="ChecklistContainer">
      <ChecklistHeader data-testid="ChecklistHeader" key={id} ref={headerRef}>
        <ChecklistEditableTitle id={id} />
        <ChecklistHeaderActions>
          <ToggleCheckedItems checklistId={id} />
          <DeleteChecklist id={id} />
        </ChecklistHeaderActions>
      </ChecklistHeader>

      <ChecklistProgress checklistId={id} />

      {showAllItemsCompleteMessage && (
        <AllItemsCompleteMessage data-testid="AllItemsCompleteMessage">
          Everything in this checklist is complete!
        </AllItemsCompleteMessage>
      )}

      <div ref={sortableGroupRef} style={{ width: '100%', minWidth: 0 }}>
        {visibleItems?.map((checklistItem, visibleIndex) => {
          function reorderItems(fromIndex: number, toIndex: number) {
            if (items && visibleItems) {
              reorderChecklistItemsByVisibleIndex({
                checklistId: id,
                items,
                visibleItems,
                fromVisible: fromIndex,
                toVisible: toIndex,
              });
            }
          }

          function moveItemToNewChecklist(args: CrossGroupMoveArgs) {
            if (!checklist) {
              return;
            }

            // Checklist items may only move between checklists on the same card.
            // Server enforces that too; client routing is via onMove on the source item.
            afterCrossContainerDrop({
              element: args.element,
              sourceContainer: sortableGroupRef.current,
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

          return (
            <Draggable
              key={checklistItem.id}
              id={checklistItem.id}
              name={checklistItem.label}
              type="checklistItem"
              parentId={id}
              index={visibleIndex}
              group={id}
              onReorder={reorderItems}
              onMove={moveItemToNewChecklist}
            >
              <ChecklistItem id={checklistItem.id} />
            </Draggable>
          );
        })}
      </div>

      {/* Append target for empty checklists or drops below the last item */}
      <DropZone id={`checklist-drop:${id}`} type="checklistItem" />

      <AddChecklistItem checklistId={id} />
    </ChecklistContainer>
  );
}
