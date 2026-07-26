import { useNavigate } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import { useState } from 'react';
import * as boardsStyles from '~/components/Boards/Boards.css';
import * as cardStyles from '~/components/Cards/Card.css';
import * as checklistItemStyles from '~/components/ChecklistItem/ChecklistItem.css';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useDeleteCard, useGetCardById } from '~/db/cards/cards.query';
import * as pageStyles from '~/styles/Page.css';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function DeleteCardPopover() {
  const [open, setOpen] = useState(false);
  const id = useCurrentCardId();
  const boardId = useCurrentBoardId();
  const { data } = useGetCardById({ id });
  const deleteCard = useDeleteCard();
  const navigate = useNavigate();

  function applyDelete() {
    deleteCard({
      cardId: id,
      listId: data?.listId ?? '',
    });
    navigate({ to: '/board/$id', params: { id: boardId }, hash: '' });
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger
        className={cardStyles.deleteCardPopoverTrigger}
        data-testid="DeleteCardPopoverTrigger"
      >
        <Tooltip content="Delete card">
          <div
            className={cardStyles.cardModalActionButton({ isOpen: open })}
            data-testid="CardModalSiderButton"
          >
            <span
              className={cardStyles.cardModalSiderButtonText}
              data-testid="CardModalSiderButtonText"
            >
              Delete Card
            </span>
          </div>
        </Tooltip>
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
          <div style={{ fontWeight: 600 }}>Delete Card?</div>
          <Popover.Close
            className={boardsStyles.popoverClose}
            data-testid="PopoverClose"
          >
            X
          </Popover.Close>
        </div>

        <div className={pageStyles.popoverOptionsContentContainer}>
          Deleting a card is permanent and there is no way to get it back.
          <button
            type="button"
            className={checklistItemStyles.deleteChecklistPopoverButton}
            data-testid="DeleteChecklistPopoverButton"
            onClick={applyDelete}
          >
            Delete card
          </button>
        </div>
      </Popover.Content>
    </Popover.Root>
  );
}
