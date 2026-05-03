import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';

import { tokenState } from '~/store/atoms';
import { useDeleteListMutation } from '~/store/listsApi';
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
  const [token] = useAtom(tokenState);
  const params = useParams({ strict: false });
  const [deleteList] = useDeleteListMutation();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger>
        <DeleteListIcon />
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {`Delete ${listTitle}`}
          <PopoverClose>X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder />
        Deleting a list is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          onClick={() => {
            deleteList({
              id,
              token: token?.access_token ?? '',
              userId: token?.user.id ?? '',
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
