import { Collapsible } from 'radix-ui';
import { useRef } from 'react';
import { BsCheck2Square } from 'react-icons/bs';
import { RiArrowRightSLine } from 'react-icons/ri';
import { AddChecklistItem } from '~/components/ChecklistItem/AddChecklistItem';
import { ChecklistItem } from '~/components/ChecklistItem/ChecklistItem';
import { ChecklistEditableTitle } from '~/components/Checklists/ChecklistEditableTitle';
import { ChecklistProgress } from '~/components/Checklists/ChecklistProgress';
import {
  AllItemsCompleteMessage,
  ChecklistCaretIcon,
  ChecklistCheckIcon,
  ChecklistCollapsibleContent,
  ChecklistContainer,
  ChecklistHeader,
  ChecklistHeaderActions,
  ChecklistHeaderLeading,
  ChecklistToggleButton,
} from '~/components/Checklists/Checklists.styled';
import { DeleteChecklist } from '~/components/Checklists/DeleteChecklist';
import { ToggleCheckedItems } from '~/components/Checklists/ToggleCheckedItems';
import { Draggable } from '~/components/shared/dnd/Draggable';
import { DropTargetFallback } from '~/components/shared/dnd/DropTargetFallback';
import {
  moveChecklistItemToNewChecklist,
  reorderChecklistItemsByVisibleIndex,
} from '~/db/checklistItems/checklistItems.cache';
import { useGetChecklistItems } from '~/db/checklistItems/checklistItems.query';
import {
  useGetChecklist,
  useUpdateChecklist,
} from '~/db/checklists/checklists.query';
import { useCrossContainerMove } from '~/utils/useCrossContainerMove';
import { useScrollToHashId } from '~/utils/useScrollToHashId';

export function Checklist({ id }: { id: string }) {
  const { isSuccess, data: checklist } = useGetChecklist({ checklistId: id });
  const { mutate: updateChecklist } = useUpdateChecklist();
  const { isSuccess: isItemsSuccess, data: items } = useGetChecklistItems({
    checklistId: id,
  });
  const { ref, onMove } = useCrossContainerMove((args) =>
    moveChecklistItemToNewChecklist({
      itemId: args.itemId,
      sourceChecklistId: args.sourceGroupId,
      targetChecklistId: args.targetGroupId,
      targetVisibleIndex: args.toIndex,
    }),
  );
  const headerRef = useRef<HTMLDivElement>(null);

  const isExpanded = checklist?.isExpanded ?? true;

  function setExpanded(open: boolean) {
    updateChecklist({
      checklistId: id,
      cardId: checklist?.cardId ?? '',
      isExpanded: open,
    });
  }

  const visibleItems = checklist?.hideCheckedItems
    ? items?.filter((item) => !item.isCompleted)
    : items;

  const showAllItemsCompleteMessage =
    checklist?.hideCheckedItems &&
    (items?.length ?? 0) > 0 &&
    visibleItems?.length === 0;

  useScrollToHashId(id, headerRef, isSuccess && isItemsSuccess);

  return (
    <Collapsible.Root open={isExpanded} onOpenChange={setExpanded} asChild>
      <ChecklistContainer>
        <ChecklistHeader key={id} ref={headerRef}>
          <ChecklistHeaderLeading>
            <ChecklistToggleButton
              $expanded={isExpanded}
              aria-label={
                isExpanded ? 'Collapse checklist' : 'Expand checklist'
              }
            >
              <ChecklistCheckIcon>
                <BsCheck2Square size={24} />
              </ChecklistCheckIcon>

              <ChecklistCaretIcon>
                <RiArrowRightSLine size={24} />
              </ChecklistCaretIcon>
            </ChecklistToggleButton>

            <ChecklistEditableTitle id={id} />
          </ChecklistHeaderLeading>

          <ChecklistHeaderActions $expanded={isExpanded}>
            <ToggleCheckedItems checklistId={id} />
            <DeleteChecklist id={id} />
          </ChecklistHeaderActions>
        </ChecklistHeader>

        <ChecklistCollapsibleContent>
          <ChecklistProgress checklistId={id} />

          {showAllItemsCompleteMessage && (
            <AllItemsCompleteMessage>
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
                  <ChecklistItem id={checklistItem.id} checklistId={id} />
                </Draggable>
              );
            })}
          </div>

          <DropTargetFallback
            id={`checklist-drop:${id}`}
            type="checklistItem"
          />

          <AddChecklistItem checklistId={id} />
        </ChecklistCollapsibleContent>
      </ChecklistContainer>
    </Collapsible.Root>
  );
}
