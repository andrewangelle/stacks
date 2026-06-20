import * as Popover from '@radix-ui/react-popover';
import { PopoverClose } from '~/components/Boards/Boards.styled';
import { DeleteCardPopoverTrigger } from '~/components/Cards/Card.styled';
import { DeleteChecklistPopoverButton } from '~/components/ChecklistItem/ChecklistItem.styled';
import { ChecklistPopoverHeader } from '~/components/Checklists/Checklists.styled';
import { DeleteListIcon } from '~/components/Lists/List.styled';
import { useDeleteList, useGetListById } from '~/db/lists/lists.query';
import {
  PopoverOptionsContent,
  PopoverOptionsContentContainer,
} from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type DeleteListProps = {
  id: string;
};

export function DeleteList({ id }: DeleteListProps) {
  const { data: list } = useGetListById({ id });
  const boardId = useCurrentBoardId();
  const deleteList = useDeleteList();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger data-testid="DeleteCardPopoverTrigger" asChild>
        <DeleteListIcon data-testid="DeleteListIcon" />
      </DeleteCardPopoverTrigger>

      <PopoverOptionsContent data-testid="PopoverOptionsContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          <div style={{ fontWeight: 600 }}>{`Delete ${list?.listTitle}?`}</div>
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>

        <PopoverOptionsContentContainer>
          Deleting a list is permanent and there is no way to get it back.
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
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
