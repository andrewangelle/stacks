import * as Popover from '@radix-ui/react-popover';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverTrigger,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistButton,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { useCreateActivity } from '~/query/activity';
import { useDeleteChecklist, useGetChecklist } from '~/query/checklists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function DeleteChecklist({ id }: { id: string }) {
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const deleteChecklist = useDeleteChecklist();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

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
          onClick={() => {
            deleteChecklist({
              checklistId: id,
              cardId: checklist.cardId,
            });

            createActivity({
              cardId: checklist.cardId,
              listId: checklist.listId,
              boardId,
              type: 'feed',
              content: `removed ${checklist.checklistTitle} from this card`,
            });
          }}
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
