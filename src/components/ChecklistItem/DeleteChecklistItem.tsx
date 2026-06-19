import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  DeleteChecklistItemEllipsis,
  DeleteChecklistItemPopoverTrigger,
  DeleteChecklistPopoverButton,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { useDeleteChecklistItem } from '~/db/checklistItems/checklistItems.query';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function DeleteChecklistItem({
  id,
  isHovering,
}: {
  id: string;
  isHovering: boolean;
}) {
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const deleteChecklistItem = useDeleteChecklistItem();
  const clickOutsideDeletePopoverRef = useOutsideClick(
    () => setDeleteOpen(false),
    isDeleteOpen,
  );
  return (
    <div ref={clickOutsideDeletePopoverRef} data-testid="DeleteChecklistItem">
      <Popover.Root open={isDeleteOpen}>
        {(isHovering || isDeleteOpen) && (
          <DeleteChecklistItemPopoverTrigger
            data-testid="DeleteChecklistItemPopoverTrigger"
            asChild
          >
            <DeleteChecklistItemEllipsis
              data-testid="DeleteChecklistItemEllipsis"
              onClick={() => setDeleteOpen((prev) => !prev)}
              style={{ fill: isDeleteOpen ? 'white' : 'black' }}
            />
          </DeleteChecklistItemPopoverTrigger>
        )}

        <DeleteChecklistPopoverContent
          data-testid="DeleteChecklistPopoverContent"
          side="bottom"
          align="start"
        >
          <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
            Item actions
            <PopoverClose
              data-testid="PopoverClose"
              onClick={() => setDeleteOpen(false)}
            >
              X
            </PopoverClose>
          </ChecklistPopoverHeader>

          <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />

          <DeleteChecklistPopoverButton
            data-testid="DeleteChecklistPopoverButton"
            onClick={() =>
              deleteChecklistItem({
                itemId: id,
              })
            }
          >
            Delete
          </DeleteChecklistPopoverButton>
        </DeleteChecklistPopoverContent>
      </Popover.Root>
    </div>
  );
}
