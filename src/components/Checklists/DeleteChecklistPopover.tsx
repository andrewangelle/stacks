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
} from '~/components/Checklists/Checklists.styled';
import {
  useDeleteChecklistMutation,
  useGetChecklistQuery,
} from '~/query/checklists';

export function DeleteChecklistPopover({ id }: { id: string }) {
  const { data: checklist } = useGetChecklistQuery({ checklistId: id });
  const deleteChecklist = useDeleteChecklistMutation();
  if (!checklist) return null;
  return (
    <Popover.Root>
      <DeleteChecklistPopoverTrigger
        asChild
        data-testid="DeleteChecklistPopoverTrigger"
      >
        <DeleteChecklistButton data-testid="DeleteChecklistButton" secondary>
          Delete
        </DeleteChecklistButton>
      </DeleteChecklistPopoverTrigger>

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {`Delete ${checklist.checklistTitle}`}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
        Deleting a checklist is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
          onClick={() =>
            deleteChecklist({
              checklistId: id,
              cardId: checklist.cardId,
            })
          }
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
