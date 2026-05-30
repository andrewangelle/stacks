import type { Activity } from '@prisma/client';
import * as Popover from '@radix-ui/react-popover';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
} from '~/components/Checklists/Checklists.styled';
import { useDeleteActivity } from '~/query/activity';

export function DeleteCommentPopover(props: Activity) {
  const deleteActivity = useDeleteActivity();
  return (
    <Popover.Root>
      <DeleteChecklistPopoverTrigger data-testid="DeleteChecklistPopoverTrigger">
        <div
          style={{
            textDecoration: 'underline',
            marginLeft: '4px',
            cursor: 'pointer',
          }}
        >
          Delete
        </div>
      </DeleteChecklistPopoverTrigger>

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {'Delete comment'}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
        Deleting a comment is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
          onClick={() =>
            deleteActivity({
              activityId: props.id,
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
