import * as Popover from '@radix-ui/react-popover';
import { DeleteCommentLink } from '~/components/Activity/Activity.styled';
import { PopoverClose } from '~/components/Boards/Boards.styled';
import { DeleteChecklistPopoverButton } from '~/components/ChecklistItem/ChecklistItem.styled';
import { ChecklistPopoverHeader } from '~/components/Checklists/Checklists.styled';
import { useDeleteActivity } from '~/db/activity/activity.query';
import type { Activity } from '~/generated/prisma/client';
import {
  PopoverOptionsContent,
  PopoverOptionsContentContainer,
} from '~/styles/Page.styled';
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

      <PopoverOptionsContent data-testid="PopoverOptionsContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          <div style={{ fontWeight: 600 }}>{strings.deleteComment}?</div>

          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>

        <PopoverOptionsContentContainer>
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
        </PopoverOptionsContentContainer>
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
