import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import {
  ChecklistItemOptionsListContainer,
  ChecklistItemOptionsListItem,
  DeleteChecklistPopoverButton,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ListActionsPopoverButton,
  ListActionsPopoverButtonBack,
  ListActionsPopoverButtonText,
  ListActionsPopoverClose,
  ListActionsPopoverHeader,
  ListActionsPopoverTrigger,
} from '~/components/Lists/List.styled';
import { Tooltip } from '~/components/Tooltip/Tooltip';
import { useDeleteList } from '~/db/lists/lists.query';
import {
  PopoverOptionsContent,
  PopoverOptionsContentContainer,
} from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type DeleteListProps = {
  id: string;
};

export function DeleteList({ id }: DeleteListProps) {
  const boardId = useCurrentBoardId();
  const deleteList = useDeleteList();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  function closePopover(open: boolean) {
    setOpen(open);
    setIsDeleting(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={closePopover}>
      <ListActionsPopoverTrigger data-testid="ListActionsPopoverTrigger">
        <Tooltip portal={true} content="List actions">
          <ListActionsPopoverButton
            data-testid="ListActionsPopoverButton"
            isOpen={open}
          >
            <ListActionsPopoverButtonText data-testid="ListActionsPopoverButtonText">
              ...
            </ListActionsPopoverButtonText>
          </ListActionsPopoverButton>
        </Tooltip>
      </ListActionsPopoverTrigger>

      <PopoverOptionsContent data-testid="PopoverOptionsContent">
        <ListActionsPopoverHeader data-testid="ChecklistPopoverHeader">
          <div>
            <ListActionsPopoverButtonBack
              tabIndex={isDeleting ? 0 : -1}
              isActive={isDeleting}
              onClick={() => setIsDeleting(false)}
            >
              {isDeleting ? '<' : ''}
            </ListActionsPopoverButtonBack>
          </div>

          <div>{isDeleting ? 'Are you sure?' : 'List actions'}</div>

          <ListActionsPopoverClose data-testid="ListActionsPopoverClose">
            X
          </ListActionsPopoverClose>
        </ListActionsPopoverHeader>

        {!isDeleting && (
          <ChecklistItemOptionsListContainer data-testid="ChecklistItemOptionsListContainer">
            <ChecklistItemOptionsListItem
              data-testid="DeleteListOption"
              onClick={() => setIsDeleting(true)}
            >
              Archive this list
            </ChecklistItemOptionsListItem>
          </ChecklistItemOptionsListContainer>
        )}

        {isDeleting && (
          <PopoverOptionsContentContainer>
            This list will be deleted
            <DeleteChecklistPopoverButton
              data-testid="DeleteChecklistPopoverButton"
              onClick={() => {
                deleteList({
                  listId: id,
                  boardId,
                });
              }}
            >
              Delete list
            </DeleteChecklistPopoverButton>
          </PopoverOptionsContentContainer>
        )}
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
