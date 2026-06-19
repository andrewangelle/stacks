import * as Popover from '@radix-ui/react-popover';
import { DeleteCommentLink } from '~/components/Activity/Activity.styled';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { DeleteChecklistPopoverButton } from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { useDeleteActivity } from '~/db/activity/activity.query';
import type { Activity } from '~/generated/prisma/client';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

const strings = {
  deleteComment: 'Delete comment',
  deleteCommentConfirmation:
    'Deleting a comment is permanent and there is no way to get it back.',
  deleteCommentButton: 'Delete',
};

export function DeleteCommentPopover(props: Pick<Activity, 'id'>) {
  const cardId = useCurrentCardId();
  const deleteActivity = useDeleteActivity();
  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <DeleteCommentLink type="button" data-testid="DeleteCommentLink">
          {strings.deleteCommentButton}
        </DeleteCommentLink>
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
              cardId,
            })
          }
        >
          {strings.deleteCommentButton}
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
