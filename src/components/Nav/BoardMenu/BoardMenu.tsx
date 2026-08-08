import { Popover } from 'radix-ui';
import { useState } from 'react';
import {
  BoardMenuOption,
  BoardMenuOptionsContainer,
  BoardMenuPopoverButton,
  BoardMenuPopoverButtonBack,
  BoardMenuPopoverButtonText,
  BoardMenuPopoverClose,
  BoardMenuPopoverHeader,
  BoardMenuPopoverTrigger,
} from '~/components/Nav/BoardMenu/BoardMenu.styled';
import { ChangeBoardBackground } from '~/components/Nav/BoardMenu/ChangeBoardBackground';
import { PopoverOptionsContent } from '~/styles/Page.styled';

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
      <BoardMenuPopoverTrigger>
        <BoardMenuPopoverButton $isOpen={open}>
          <BoardMenuPopoverButtonText>...</BoardMenuPopoverButtonText>
        </BoardMenuPopoverButton>
      </BoardMenuPopoverTrigger>

      <PopoverOptionsContent style={{ width: '332px' }}>
        <BoardMenuPopoverHeader>
          <div>
            <BoardMenuPopoverButtonBack
              tabIndex={view !== 'actions' ? 0 : -1}
              $isActive={view !== 'actions'}
              onClick={() => setView('actions')}
            >
              {view !== 'actions' ? '<' : ''}
            </BoardMenuPopoverButtonBack>
          </div>

          <div>{viewTitles[view]}</div>

          <BoardMenuPopoverClose>X</BoardMenuPopoverClose>
        </BoardMenuPopoverHeader>

        {view === 'actions' && (
          <BoardMenuOptionsContainer>
            <BoardMenuOption onClick={() => setView('changeBackground')}>
              Change background
            </BoardMenuOption>
          </BoardMenuOptionsContainer>
        )}

        {view === 'changeBackground' && <ChangeBoardBackground />}
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
