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
  const deleteChecklistItem = useDeleteChecklistItem();
  const clickOutsidePopoverRef = useOutsideClick(() => setOpen(false), isOpen);

  return (
    <div ref={clickOutsidePopoverRef} data-testid="ChecklistItemOptions">
      <Popover.Root open={isOpen} onOpenChange={setOpen}>
        {(isHovering || isOpen) && (
          <ChecklistItemOptionsPopoverTrigger
            data-testid="ChecklistItemOptionsPopoverTrigger"
            asChild
          >
            <ChecklistItemOptionsEllipsis
              data-testid="ChecklistItemOptionsEllipsis"
              onClick={() => setOpen((prev) => !prev)}
              style={{ fill: isOpen ? 'white' : 'black' }}
            />
          </ChecklistItemOptionsPopoverTrigger>
        )}

        <PopoverOptionsContent
          data-testid="PopoverOptionsContent"
          side="bottom"
          align="start"
          sideOffset={8}
          alignOffset={4}
        >
          <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
            <div style={{ fontWeight: 600 }}>Item actions</div>

            <PopoverClose
              data-testid="PopoverClose"
              onClick={() => setOpen(false)}
            >
              X
            </PopoverClose>
          </ChecklistPopoverHeader>

          <ChecklistItemOptionsListContainer data-testid="ChecklistItemOptionsListContainer">
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
