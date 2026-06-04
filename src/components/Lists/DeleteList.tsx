import * as Popover from '@radix-ui/react-popover';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { DeleteCardPopoverTrigger } from '~/components/Cards/Card.styled';
import { DeleteChecklistPopoverButton } from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { DeleteListIcon } from '~/components/Lists/List.styled';
import { useDeleteList, useGetListById } from '~/query/lists';
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

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {`Delete ${list?.listTitle}`}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
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
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
