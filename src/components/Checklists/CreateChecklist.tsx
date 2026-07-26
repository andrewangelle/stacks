import { Popover } from 'radix-ui';
import { useState } from 'react';
import { BsCheck2Square } from 'react-icons/bs';
import * as boardsStyles from '~/components/Boards/Boards.css';
import * as cardStyles from '~/components/Cards/Card.css';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useGetCardById } from '~/db/cards/cards.query';
import { useCreateChecklist } from '~/db/checklists/checklists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CreateChecklist() {
  const [open, setOpen] = useState(false);
  const cardId = useCurrentCardId();
  const boardId = useCurrentBoardId();
  const { data } = useGetCardById({ id: cardId });

  const [checklistTitle, setChecklistTitle] = useState('');
  const createChecklist = useCreateChecklist();
  const createActivity = useCreateActivity();

  function addChecklist() {
    createChecklist({
      checklistTitle,
      cardId,
      listId: data?.listId ?? '',
    });

    createActivity({
      cardId,
      listId: data?.listId ?? '',
      boardId,
      type: 'feed',
      content: `added ${checklistTitle} to this card`,
    });

    setChecklistTitle('');
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cardStyles.createChecklistPopoverTrigger}
        data-testid="CreateChecklistPopoverTrigger"
      >
        <Tooltip content="Create checklist">
          <div
            className={cardStyles.cardModalActionButton({ isOpen: open })}
            data-testid="CardModalActionButton"
          >
            <BsCheck2Square
              style={{ marginRight: '4px', position: 'relative', top: '2px' }}
            />
            <span
              className={cardStyles.cardModalSiderButtonText}
              data-testid="CardModalSiderButtonText"
            >
              Checklist
            </span>
          </div>
        </Tooltip>
      </Popover.Trigger>

      <Popover.Content
        className={checklistsStyles.checklistPopoverContent}
        data-testid="ChecklistPopoverContent"
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
        <div
          className={checklistsStyles.checklistPopoverHeader}
          data-testid="ChecklistPopoverHeader"
        >
          Add checklist
          <Popover.Close
            className={boardsStyles.popoverClose}
            data-testid="PopoverClose"
          >
            X
          </Popover.Close>
        </div>

        <hr
          className={boardsStyles.createBoardCloseBorder}
          data-testid="CreateBoardCloseBorder"
        />

        <div
          className={checklistsStyles.createChecklistTitle}
          data-testid="CreateChecklistTitle"
        >
          Title
        </div>

        <input
          className={checklistsStyles.createChecklistInput}
          data-testid="CreateChecklistInput"
          value={checklistTitle}
          onChange={(event) => setChecklistTitle(event.target.value)}
        />

        <button
          type="button"
          className={checklistsStyles.createChecklistAddButton}
          data-testid="CreateChecklistAddButton"
          onClick={addChecklist}
        >
          Add
        </button>
      </Popover.Content>
    </Popover.Root>
  );
}
