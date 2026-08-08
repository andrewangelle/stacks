import { Popover } from 'radix-ui';
import { useState } from 'react';
import { PopoverClose } from '~/components/Boards/Boards.styled';
import {
  ChecklistItemOptionsEllipsis,
  ChecklistItemOptionsListContainer,
  ChecklistItemOptionsListItem,
  ChecklistItemOptionsPopoverTrigger,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { ConvertChecklistItemToCardButton } from '~/components/ChecklistItem/ConvertChecklistItemToCardButton';
import { ChecklistPopoverHeader } from '~/components/Checklists/Checklists.styled';
import { useDeleteChecklistItem } from '~/db/checklistItems/checklistItems.query';
import { PopoverOptionsContent } from '~/styles/Page.styled';
import { useOutsideClick } from '~/utils/useOutsideClick';

type ChecklistItemOptionsProps = {
  id: string;
  checklistId: string;
  isHovering: boolean;
};

export function ChecklistItemOptions({
  id,
  checklistId,
  isHovering,
}: ChecklistItemOptionsProps) {
  const [isOpen, setOpen] = useState(false);
  const deleteChecklistItem = useDeleteChecklistItem({ checklistId });
  const clickOutsidePopoverRef = useOutsideClick(() => setOpen(false), isOpen);

  return (
    <div ref={clickOutsidePopoverRef} data-testid="ChecklistItemOptions">
      <Popover.Root open={isOpen} onOpenChange={setOpen}>
        {(isHovering || isOpen) && (
          <ChecklistItemOptionsPopoverTrigger asChild>
            <ChecklistItemOptionsEllipsis
              onClick={() => setOpen((prev) => !prev)}
              style={{ fill: isOpen ? 'white' : 'black' }}
            />
          </ChecklistItemOptionsPopoverTrigger>
        )}

        <PopoverOptionsContent
          side="bottom"
          align="start"
          sideOffset={8}
          alignOffset={4}
        >
          <ChecklistPopoverHeader>
            <div style={{ fontWeight: 600 }}>Item actions</div>

            <PopoverClose onClick={() => setOpen(false)}>X</PopoverClose>
          </ChecklistPopoverHeader>

          <ChecklistItemOptionsListContainer>
            <ConvertChecklistItemToCardButton
              id={id}
              checklistId={checklistId}
            />

            <ChecklistItemOptionsListItem
              data-testid="DeleteChecklistItemButton"
              onClick={() =>
                deleteChecklistItem({
                  itemId: id,
                })
              }
            >
              Delete
            </ChecklistItemOptionsListItem>
          </ChecklistItemOptionsListContainer>
        </PopoverOptionsContent>
      </Popover.Root>
    </div>
  );
}
