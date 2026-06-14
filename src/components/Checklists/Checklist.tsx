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
import { Draggable } from '~/components/Draggable';
import {
  reorderChecklistItemsByVisibleIndex,
  useGetChecklistItems,
} from '~/query/checklistItems';
import { useGetChecklist } from '~/query/checklists';
import { useHashChecklistId } from '~/utils/useHashChecklistId';

export function Checklist({ id }: { id: string }) {
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
  const ref = useRef<HTMLDivElement>(null);

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
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }

    return () => clearTimeout(timeoutId);
  }, [hashId, id, isSuccess, isItemsSuccess]);

  if (isLoading) {
    return <ChecklistSkeleton />;
  }

  return (
    <ChecklistContainer data-testid="ChecklistContainer">
      <ChecklistHeader data-testid="ChecklistHeader" key={id} ref={ref}>
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

      {visibleItems?.map((checklistItem, visibleIndex) => (
        <Draggable
          key={checklistItem.id}
          id={checklistItem.id}
          name={checklistItem.label}
          type="checklistItem"
          index={visibleIndex}
          group={id}
          onReorder={(from, to) =>
            items &&
            visibleItems &&
            reorderChecklistItemsByVisibleIndex(
              id,
              items,
              visibleItems,
              from,
              to,
            )
          }
        >
          <ChecklistItem id={checklistItem.id} />
        </Draggable>
      ))}

      <AddChecklistItem checklistId={id} />
    </ChecklistContainer>
  );
}
