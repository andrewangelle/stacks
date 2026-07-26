import { Popover } from 'radix-ui';
import { useState } from 'react';
import { AiOutlineEllipsis } from 'react-icons/ai';
import * as boardsStyles from '~/components/Boards/Boards.css';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import { ConvertChecklistItemToCardButton } from '~/components/ChecklistItem/ConvertChecklistItemToCardButton';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
import { useDeleteChecklistItem } from '~/db/checklistItems/checklistItems.query';
import * as pageStyles from '~/styles/Page.css';
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
          <Popover.Trigger
            className={checklistItemStyles.checklistItemOptionsPopoverTrigger}
            data-testid="ChecklistItemOptionsPopoverTrigger"
            asChild
          >
            <AiOutlineEllipsis
              className={checklistItemStyles.checklistItemOptionsEllipsis}
              data-testid="ChecklistItemOptionsEllipsis"
              onClick={() => setOpen((prev) => !prev)}
              style={{ fill: isOpen ? 'white' : 'black' }}
            />
          </Popover.Trigger>
        )}

        <Popover.Content
          className={pageStyles.popoverOptionsContent}
          data-testid="PopoverOptionsContent"
          side="bottom"
          align="start"
          sideOffset={8}
          alignOffset={4}
        >
          <div
            className={checklistsStyles.checklistPopoverHeader}
            data-testid="ChecklistPopoverHeader"
          >
            <div style={{ fontWeight: 600 }}>Item actions</div>

            <Popover.Close
              className={boardsStyles.popoverClose}
              data-testid="PopoverClose"
              onClick={() => setOpen(false)}
            >
              X
            </Popover.Close>
          </div>

          <div
            className={checklistItemStyles.checklistItemOptionsListContainer}
            data-testid="ChecklistItemOptionsListContainer"
          >
            <ConvertChecklistItemToCardButton
              id={id}
              checklistId={checklistId}
            />

            <button
              type="button"
              className={checklistItemStyles.checklistItemOptionsListItem}
              data-testid="DeleteChecklistItemButton"
              onClick={() =>
                deleteChecklistItem({
                  itemId: id,
                })
              }
            >
              Delete
            </button>
          </div>
        </Popover.Content>
      </Popover.Root>
    </div>
  );
}
