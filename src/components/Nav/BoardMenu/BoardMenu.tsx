import { useNavigate } from '@tanstack/react-router';
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
  DeleteBoardButton,
} from '~/components/Nav/BoardMenu/BoardMenu.styled';
import { ChangeBoardBackground } from '~/components/Nav/BoardMenu/ChangeBoardBackground';
import { useDeleteBoard } from '~/db/boards/boards.query';
import {
  PopoverOptionsContent,
  PopoverOptionsContentContainer,
} from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type Views = 'actions' | 'changeBackground' | 'delete';

const viewTitles: Record<Views, string> = {
  actions: 'Menu',
  changeBackground: 'Change background',
  delete: 'Are you sure?',
};

export function BoardMenu() {
  const boardId = useCurrentBoardId();
  const deleteBoard = useDeleteBoard();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Views>('actions');

  function closePopover(open: boolean) {
    setOpen(open);
    setView('actions');
  }

  function applyDelete() {
    deleteBoard({ boardId });
    navigate({ to: '/boards' });
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

            <BoardMenuOption onClick={() => setView('delete')}>
              Archive this board
            </BoardMenuOption>
          </BoardMenuOptionsContainer>
        )}

        {view === 'changeBackground' && <ChangeBoardBackground />}

        {view === 'delete' && (
          <PopoverOptionsContentContainer>
            <p style={{ color: 'black' }}>
              This board and all of its data will be deleted
            </p>
            <DeleteBoardButton onClick={applyDelete}>
              Delete board
            </DeleteBoardButton>
          </PopoverOptionsContentContainer>
        )}
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
