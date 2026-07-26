import { Popover } from 'radix-ui';
import { useState } from 'react';
import * as boardsStyles from '~/components/Boards/Boards.css';
import * as cardStyles from '~/components/Cards/Card.css';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
import { useCreateActivity } from '~/db/activity/activity.query';
import {
  useDeleteChecklist,
  useGetChecklist,
} from '~/db/checklists/checklists.query';
import * as pageStyles from '~/styles/Page.css';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function DeleteChecklist({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const deleteChecklist = useDeleteChecklist();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  function applyDelete() {
    if (checklist) {
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
    }
  }

  if (!checklist) return null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={checklistItemStyles.deleteChecklistPopoverTrigger}
        data-testid="DeleteChecklistPopoverTrigger"
      >
        <div
          className={`${cardStyles.cardModalActionButton({ isOpen: open })} ${checklistsStyles.deleteChecklistButtonSize}`}
          data-testid="DeleteChecklistButton"
        >
          Delete
        </div>
      </Popover.Trigger>

      <Popover.Content
        className={pageStyles.popoverOptionsContent}
        data-testid="PopoverOptionsContent"
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
        <div
          className={checklistsStyles.checklistPopoverHeader}
          data-testid="ChecklistPopoverHeader"
        >
          <div
            style={{ fontWeight: 600 }}
          >{`Delete ${checklist.checklistTitle}?`}</div>
          <Popover.Close
            className={boardsStyles.popoverClose}
            data-testid="PopoverClose"
          >
            X
          </Popover.Close>
        </div>

        <div className={pageStyles.popoverOptionsContentContainer}>
          Deleting a checklist is permanent and there is no way to get it back.
          <button
            type="button"
            className={checklistItemStyles.deleteChecklistPopoverButton}
            data-testid="DeleteChecklistPopoverButton"
            onClick={applyDelete}
          >
            Delete checklist
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
