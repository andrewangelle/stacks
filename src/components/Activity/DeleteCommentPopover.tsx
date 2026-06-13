import * as Popover from '@radix-ui/react-popover';
import { EditCommentLink } from '~/components/Activity/Activity.styled';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { DeleteChecklistPopoverButton } from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import type { Activity } from '~/generated/prisma/client';
import { useDeleteActivity } from '~/query/activity';

const strings = {
  deleteComment: 'Delete comment',
  deleteCommentConfirmation:
    'Deleting a comment is permanent and there is no way to get it back.',
  deleteCommentButton: 'Delete',
};

export function DeleteCommentPopover(props: Pick<Activity, 'id' | 'cardId'>) {
  const deleteActivity = useDeleteActivity();
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <EditCommentLink
          type="button"
          data-testid="DeleteChecklistPopoverTrigger"
        >
          {strings.deleteCommentButton}
        </EditCommentLink>
      </Popover.Trigger>

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {strings.deleteComment}

          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>

        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />

        {strings.deleteCommentConfirmation}

        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
          onClick={() =>
            deleteActivity({
              activityId: props.id,
              cardId: props.cardId,
            })
          }
        >
          {strings.deleteCommentButton}
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
