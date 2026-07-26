import { Popover } from 'radix-ui';
import { useState } from 'react';
import * as listActionsStyles from '~/components/Lists/ListActions/ListActions.css';
import { MoveListMenu } from '~/components/Lists/ListActions/MoveListMenu';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useDeleteList } from '~/db/lists/lists.query';
import * as pageStyles from '~/styles/Page.css';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type ListActionsProps = {
  id: string;
};

type Views = 'actions' | 'move' | 'delete';

const viewTitles: Record<Views, string> = {
  actions: 'List actions',
  move: 'Move list',
  delete: 'Are you sure?',
};

export function ListActions({ id }: ListActionsProps) {
  const boardId = useCurrentBoardId();
  const deleteList = useDeleteList();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Views>('actions');

  function closePopover(open: boolean) {
    setOpen(open);
    setView('actions');
  }

  return (
    <Popover.Root open={open} onOpenChange={closePopover}>
      <Popover.Trigger
        className={listActionsStyles.listActionsPopoverTrigger}
        data-testid="ListActionsPopoverTrigger"
      >
        <Tooltip content="List actions">
          <div
            className={listActionsStyles.listActionsPopoverButton({
              isOpen: open,
            })}
            data-testid="ListActionsPopoverButton"
          >
            <span
              className={listActionsStyles.listActionsPopoverButtonText}
              data-testid="ListActionsPopoverButtonText"
            >
              ...
            </span>
          </div>
        </Tooltip>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className={pageStyles.popoverOptionsContent}
          data-testid="PopoverOptionsContent"
        >
          <div
            className={listActionsStyles.listActionsPopoverHeader}
            data-testid="ListActionsPopoverHeader"
          >
            <div>
              <button
                type="button"
                className={listActionsStyles.listActionsPopoverButtonBack({
                  isActive: view !== 'actions',
                })}
                tabIndex={view !== 'actions' ? 0 : -1}
                onClick={() => setView('actions')}
              >
                {view !== 'actions' ? '<' : ''}
              </button>
            </div>

            <div>{viewTitles[view]}</div>

            <Popover.Close
              className={listActionsStyles.listActionsPopoverClose}
              data-testid="ListActionsPopoverClose"
            >
              X
            </Popover.Close>
          </div>

          {view === 'actions' && (
            <div
              className={listActionsStyles.listActionsOptionsContainer}
              data-testid="ListActionsOptionsContainer"
            >
              <button
                type="button"
                className={listActionsStyles.listActionsOption}
                data-testid="ListActionsOption"
                onClick={() => setView('move')}
              >
                Move list
              </button>

              <button
                type="button"
                className={listActionsStyles.listActionsOption}
                data-testid="ListActionsOption"
                onClick={() => setView('delete')}
              >
                Archive this list
              </button>
            </div>
          )}

          {view === 'move' && (
            <MoveListMenu id={id} closeMenu={() => closePopover(false)} />
          )}

          {view === 'delete' && (
            <div className={pageStyles.popoverOptionsContentContainer}>
              This list will be deleted
              <button
                type="button"
                className={listActionsStyles.deleteListButton}
                data-testid="DeleteListButton"
                onClick={() =>
                  deleteList({
                    listId: id,
                    boardId,
                  })
                }
              >
                Delete list
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
