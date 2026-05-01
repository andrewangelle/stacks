import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@remix-run/react';
import { useRecoilState } from 'recoil';

import { tokenState, useDeleteListMutation } from '~/store';
import {
  ChecklistPopoverHeader,
  CreateBoardCloseBorder,
  DeleteCardPopoverTrigger,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteListIcon,
  PopoverClose,
} from '~/styles';

export function DeleteListPopover(props: { id: string; listTitle: string }) {
  const [token] = useRecoilState(tokenState);
  const params = useParams();
  const [deleteList] = useDeleteListMutation();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger>
        <DeleteListIcon />
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {`Delete ${props.listTitle}`}
          <PopoverClose>X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder />
        Deleting a list is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          onClick={() => {
            deleteList({
              id: props.id,
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
