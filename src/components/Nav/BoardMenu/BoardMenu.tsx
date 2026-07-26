import { Popover } from 'radix-ui';
import { useState } from 'react';
import * as boardMenuStyles from '~/components/Nav/BoardMenu/BoardMenu.css';
import { ChangeBoardBackground } from '~/components/Nav/BoardMenu/ChangeBoardBackground';
import * as pageStyles from '~/styles/Page.css';

type Views = 'actions' | 'changeBackground';

const viewTitles: Record<Views, string> = {
  actions: 'Menu',
  changeBackground: 'Change background',
};

export function BoardMenu() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Views>('actions');

  function closePopover(open: boolean) {
    setOpen(open);
    setView('actions');
  }

  return (
    <Popover.Root open={open} onOpenChange={closePopover}>
      <Popover.Trigger
        className={boardMenuStyles.boardMenuPopoverTrigger}
        data-testid="BoardMenuPopoverTrigger"
      >
        <div
          className={boardMenuStyles.boardMenuPopoverButton({ isOpen: open })}
          data-testid="BoardMenuPopoverButton"
        >
          <span
            className={boardMenuStyles.boardMenuPopoverButtonText}
            data-testid="BoardMenuPopoverButtonText"
          >
            ...
          </span>
        </div>
      </Popover.Trigger>

      <Popover.Content
        className={pageStyles.popoverOptionsContent}
        data-testid="PopoverOptionsContent"
      >
        <div
          className={boardMenuStyles.boardMenuPopoverHeader}
          data-testid="BoardMenuPopoverHeader"
        >
          <div>
            <button
              type="button"
              className={boardMenuStyles.boardMenuPopoverButtonBack({
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
            className={boardMenuStyles.boardMenuPopoverClose}
            data-testid="BoardMenuPopoverClose"
          >
            X
          </Popover.Close>
        </div>

        {view === 'actions' && (
          <div
            className={boardMenuStyles.boardMenuOptionsContainer}
            data-testid="BoardMenuOptionsContainer"
          >
            <button
              type="button"
              className={boardMenuStyles.boardMenuOption}
              data-testid="BoardMenuOption"
              onClick={() => setView('changeBackground')}
            >
              Change background
            </button>
          </div>
        )}

        {view === 'changeBackground' && <ChangeBoardBackground />}
      </Popover.Content>
    </Popover.Root>
  );
}
