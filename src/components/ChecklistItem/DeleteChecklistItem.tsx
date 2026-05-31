import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import * as AiIcons from 'react-icons/ai';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverTrigger,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { useDeleteChecklistItem } from '~/query/checklistItems';
import { useOutsideClick } from '~/utils/useOutsideClick';

const AiOutlineEllipsis = AiIcons.AiOutlineEllipsis;

export function DeleteChecklistItem({ id }: { id: string }) {
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const deleteChecklistItem = useDeleteChecklistItem();
  const clickOutsideDeletePopoverRef = useOutsideClick(
    () => setDeleteOpen(false),
    isDeleteOpen,
  );
  return (
    <div ref={clickOutsideDeletePopoverRef}>
      <Popover.Root open={isDeleteOpen}>
        <DeleteChecklistPopoverTrigger data-testid="DeleteChecklistPopoverTrigger">
          <AiOutlineEllipsis
            onClick={() => setDeleteOpen(true)}
            style={{ position: 'relative', top: '1px' }}
          />
        </DeleteChecklistPopoverTrigger>

        <DeleteChecklistPopoverContent
          data-testid="DeleteChecklistPopoverContent"
          side="right"
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
