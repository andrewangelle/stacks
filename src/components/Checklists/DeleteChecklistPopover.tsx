import * as Popover from '@radix-ui/react-popover';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistButton,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
} from '~/components/Cards/CardModal.styled';
import {
  type ChecklistType,
  useDeleteChecklistMutation,
} from '~/query/checklists';

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
