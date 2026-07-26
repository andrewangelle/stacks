import { Popover } from 'radix-ui';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import * as boardsStyles from '~/components/Boards/Boards.css';
import { useCreateBoard } from '~/db/boards/boards.query';
import * as pageStyles from '~/styles/Page.css';
import type { BoardBackground } from '~/styles/tokens';

const backgroundChoices: BoardBackground[] = [
  'green',
  'lightGreen',
  'blue',
  'orange',
  'red',
];

export function CreateBoard() {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [boardTitle, setBoardTitle] = useState('');
  const createBoard = useCreateBoard();

  function onBoardCreate() {
    if (!boardTitle) {
      return;
    }

    createBoard({
      boardColor: selectedColor,
      boardTitle,
    });
  }

  return (
    <Popover.Root open={isCreateOpen} onOpenChange={setCreateOpen}>
      <Popover.Trigger
        className={boardsStyles.createBoardPopoverTrigger}
        data-testid="CreateBoardPopoverTrigger"
      >
        <div
          className={boardsStyles.createBoardCard}
          data-testid="CreateBoardCard"
        >
          Create new board
        </div>
      </Popover.Trigger>

      <Popover.Content
        className={boardsStyles.createBoardPopoverContent}
        data-testid="CreateBoardPopoverContent"
        side="bottom"
      >
        <div
          className={boardsStyles.createBoardPopoverHeader}
          data-testid="CreateBoardPopoverHeader"
        >
          Create Board
          <Popover.Close
            className={boardsStyles.popoverClose}
            data-testid="PopoverClose"
            onClick={() => setCreateOpen(false)}
            autoFocus
          >
            X
          </Popover.Close>
        </div>

        <hr
          className={boardsStyles.createBoardCloseBorder}
          data-testid="CreateBoardCloseBorder"
        />

        <div
          className={boardsStyles.createBoardBackgroundText}
          data-testid="CreateBoardBackgroundText"
        >
          Background
        </div>

        <div
          className={boardsStyles.createBoardBackgroundChoices}
          data-testid="CreateBoardBackgroundChoices"
        >
          {backgroundChoices.map((color) => (
            <button
              type="button"
              key={color}
              data-testid="CreateBoardBackgroundChoice"
              className={boardsStyles.createBoardBackgroundChoice({
                background: color,
              })}
              onClick={() => setSelectedColor(color)}
            >
              {color === selectedColor && (
                <div className={pageStyles.center} data-testid="Center">
                  <FaCheck />
                </div>
              )}
            </button>
          ))}
        </div>

        <div
          className={boardsStyles.createBoardBackgroundText}
          data-testid="CreateBoardBackgroundText"
        >
          Board Title
        </div>

        <input
          className={boardsStyles.createBoardTitleInput}
          data-testid="CreateBoardTitleInput"
          onChange={(event) => setBoardTitle(event.target.value)}
          value={boardTitle}
        />

        <button
          type="button"
          className={boardsStyles.createBoardButton({ disabled: !boardTitle })}
          data-testid="CreateBoardButton"
          disabled={!boardTitle}
          onClick={onBoardCreate}
        >
          Create
        </button>
      </Popover.Content>
    </Popover.Root>
  );
}
