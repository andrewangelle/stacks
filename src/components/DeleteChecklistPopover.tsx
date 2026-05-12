import * as Popover from '@radix-ui/react-popover';
import {
  type ChecklistType,
  useDeleteChecklistMutation,
} from '~/store/checklistsApi';
import { CreateBoardCloseBorder, PopoverClose } from '~/styles/Boards';
import {
  ChecklistPopoverHeader,
  DeleteChecklistButton,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
} from '~/styles/CardModal';

export function DeleteChecklistPopover(props: ChecklistType) {
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
