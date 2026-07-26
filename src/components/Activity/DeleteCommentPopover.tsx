import { Popover } from 'radix-ui';
import * as activityStyles from '~/components/Activity/Activity.css';
import * as boardsStyles from '~/components/Boards/Boards.css';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
import { useDeleteActivity } from '~/db/activity/activity.query';
import type { Activity } from '~/generated/prisma/client';
import * as pageStyles from '~/styles/Page.css';
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
        <button
          className={activityStyles.editCommentLink}
          type="button"
          data-testid="DeleteCommentLink"
        >
          {strings.deleteCommentButton}
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={activityStyles.deleteCommentPopoverContent}
          data-testid="PopoverOptionsContent"
          side="bottom"
          align="start"
          sideOffset={8}
        >
          <div
            className={checklistsStyles.checklistPopoverHeader}
            data-testid="ChecklistPopoverHeader"
          >
            <div style={{ fontWeight: 600 }}>{strings.deleteComment}?</div>

            <Popover.Close
              className={boardsStyles.popoverClose}
              data-testid="PopoverClose"
            >
              X
            </Popover.Close>
          </div>

          <div className={pageStyles.popoverOptionsContentContainer}>
            {strings.deleteCommentConfirmation}

            <button
              type="button"
              className={checklistItemStyles.deleteChecklistPopoverButton}
              data-testid="DeleteChecklistPopoverButton"
              onClick={() =>
                deleteActivity({
                  activityId: props.id,
                  cardId,
                })
              }
            >
              {strings.deleteCommentButton}
            </button>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
