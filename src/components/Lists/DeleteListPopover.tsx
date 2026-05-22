import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { DeleteCardPopoverTrigger } from '~/components/Cards/CardModal.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { DeleteListIcon } from '~/components/Lists/List.styled';
import { useDeleteListMutation } from '~/query/lists';

type DeleteListPopoverProps = {
  id: string;
  listTitle: string;
};

export function DeleteListPopover({ id, listTitle }: DeleteListPopoverProps) {
  const params = useParams({ strict: false });
  const [deleteList] = useDeleteListMutation();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger data-testid="DeleteCardPopoverTrigger">
        <DeleteListIcon data-testid="DeleteListIcon" />
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {`Delete ${listTitle}`}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
        Deleting a list is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
          onClick={() => {
            deleteList({
              id,
              boardId: params.id ?? '',
            });
          }}
        >
          Delete list
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
