import { useRef } from 'react';
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
import { Draggable } from '~/components/dnd/Draggable';
import { DropTargetFallback } from '~/components/dnd/DropTargetFallback';
import {
  reorderChecklistItemsByVisibleIndex,
  useGetChecklistItems,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { useMoveItemToNewChecklist } from '~/utils/useMoveItemToNewChecklist';
import { useScrollToChecklist } from '~/utils/useScrollToChecklist';

export function Checklist({ id }: { id: string }) {
  const {
    isLoading,
    isSuccess,
    data: checklist,
  } = useGetChecklist({
    checklistId: id,
  });
  const { ref, onMove } = useMoveItemToNewChecklist(checklist?.cardId);
  const { isSuccess: isItemsSuccess, data: items } = useGetChecklistItems({
    checklistId: id,
  });
  const headerRef = useRef<HTMLDivElement>(null);

  const visibleItems = checklist?.hideCheckedItems
    ? items?.filter((item) => !item.isCompleted)
    : items;

  const showAllItemsCompleteMessage =
    checklist?.hideCheckedItems &&
    (items?.length ?? 0) > 0 &&
    visibleItems?.length === 0;

  useScrollToChecklist(id, headerRef, isSuccess && isItemsSuccess);

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

      <div ref={ref} style={{ width: '100%', minWidth: 0 }}>
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
              onMove={onMove}
            >
              <ChecklistItem id={checklistItem.id} />
            </Draggable>
          );
        })}
      </div>

      <DropTargetFallback id={`checklist-drop:${id}`} type="checklistItem" />

      <AddChecklistItem checklistId={id} />
    </ChecklistContainer>
  );
}
