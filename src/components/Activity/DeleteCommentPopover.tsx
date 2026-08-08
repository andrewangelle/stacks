import { Popover } from 'radix-ui';
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
        <DeleteCommentLink type="button">
          {strings.deleteCommentButton}
        </DeleteCommentLink>
      </Popover.Trigger>

      <Popover.Portal>
        <PopoverOptionsContent style={{ zIndex: 3 }}>
          <ChecklistPopoverHeader>
            <div style={{ fontWeight: 600 }}>{strings.deleteComment}?</div>

            <PopoverClose>X</PopoverClose>
          </ChecklistPopoverHeader>

          <PopoverOptionsContentContainer>
            {strings.deleteCommentConfirmation}

            <DeleteChecklistPopoverButton
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
      </Popover.Portal>
    </Popover.Root>
  );
}
