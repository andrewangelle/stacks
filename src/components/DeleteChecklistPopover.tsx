import * as Popover from '@radix-ui/react-popover';
import {
  type ChecklistType,
  useDeleteChecklistMutation,
} from '~/query/checklistsApi';
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
      <DeleteChecklistPopoverTrigger data-testid="DeleteChecklistPopoverTrigger">
        <DeleteChecklistButton data-testid="DeleteChecklistButton" secondary>
          Delete
        </DeleteChecklistButton>
      </DeleteChecklistPopoverTrigger>

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {`Delete ${props.checklistTitle}`}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
        Deleting a checklist is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
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
