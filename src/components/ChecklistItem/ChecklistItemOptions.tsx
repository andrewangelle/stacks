import * as Popover from '@radix-ui/react-popover';
import { useEffect, useState } from 'react';
import { PopoverClose } from '~/components/Boards/Boards.styled';
import {
  ChecklistItemOptionsEllipsis,
  ChecklistItemOptionsListContainer,
  ChecklistItemOptionsListItem,
  ChecklistItemOptionsPopoverTrigger,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import { ChecklistPopoverHeader } from '~/components/Checklists/Checklists.styled';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useCreateCard } from '~/db/cards/cards.query';
import {
  useDeleteChecklistItem,
  useGetChecklistItem,
} from '~/db/checklistItems/checklistItems.query';
import { PopoverOptionsContent } from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useOutsideClick } from '~/utils/useOutsideClick';

type ChecklistItemOptionsProps = {
  id: string;
  isHovering: boolean;
};

export function ChecklistItemOptions({
  id,
  isHovering,
}: ChecklistItemOptionsProps) {
  const { data: checklistItem } = useGetChecklistItem({ itemId: id });
  const [isOpen, setOpen] = useState(false);
  const deleteChecklistItem = useDeleteChecklistItem();
  const clickOutsidePopoverRef = useOutsideClick(() => setOpen(false), isOpen);
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();
  const {
    mutate: createCard,
    isSuccess: isCardCreated,
    data: response,
  } = useCreateCard();

  function convertToCard() {
    if (checklistItem) {
      createCard({
        listId: checklistItem.listId,
        cardTitle: checklistItem.label,
      });
    }
  }

  useEffect(() => {
    if (isCardCreated && response.data[0].id && checklistItem) {
      createActivity({
        cardId: response.data[0].id,
        listId: checklistItem.listId,
        boardId,
        type: 'feed',
        content: `converted this card from a checklist item on {{ linkTo:${checklistItem.cardId} }}`,
      });

      deleteChecklistItem({
        itemId: id,
      });
    }
  }, [
    isCardCreated,
    response,
    checklistItem,
    boardId,
    createActivity,
    deleteChecklistItem,
    id,
  ]);

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
            <ChecklistItemOptionsListItem
              data-testid="ChecklistItemOptionsListItem"
              onClick={convertToCard}
            >
              Convert to card
            </ChecklistItemOptionsListItem>

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
