import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { useDeleteListMutation } from '~/query/lists';
import { CreateBoardCloseBorder, PopoverClose } from '~/styles/Boards';
import {
  ChecklistPopoverHeader,
  DeleteCardPopoverTrigger,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
} from '~/styles/CardModal';
import { DeleteListIcon } from '~/styles/List';

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
