import * as Popover from '@radix-ui/react-popover';
import { useAtom } from 'jotai';
import { tokenState } from '~/store/atoms';
import {
  type ChecklistType,
  useDeleteChecklistMutation,
} from '~/store/checklistsApi';
import {
  ChecklistPopoverHeader,
  CreateBoardCloseBorder,
  DeleteChecklistButton,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
  PopoverClose,
} from '~/styles/CardModal';

export function DeleteChecklistPopover(props: ChecklistType) {
  const [token] = useAtom(tokenState);
  const [deleteChecklist] = useDeleteChecklistMutation();
  return (
    <Popover.Root>
      <DeleteChecklistPopoverTrigger>
        <DeleteChecklistButton secondary>Delete</DeleteChecklistButton>
      </DeleteChecklistPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {`Delete ${props.checklistTitle}`}
          <PopoverClose>X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder />
        Deleting a checklist is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          onClick={() =>
            deleteChecklist({
              token: token?.access_token ?? '',
              id: props.id,
              cardId: props.cardId,
            })
          }
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
