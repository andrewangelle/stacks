import { Popover } from 'radix-ui';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import {
  type BoardBackground,
  CreateBoardBackgroundChoice,
  CreateBoardBackgroundChoices,
  CreateBoardBackgroundText,
  CreateBoardButton,
  CreateBoardCard,
  CreateBoardCloseBorder,
  CreateBoardPopoverContent,
  CreateBoardPopoverHeader,
  CreateBoardPopoverTrigger,
  CreateBoardTitleInput,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { useCreateBoard } from '~/db/boards/boards.query';

import { Center } from '~/styles/Page.styled';

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
    <Popover.Root open={isCreateOpen}>
      <CreateBoardPopoverTrigger data-testid="CreateBoardPopoverTrigger">
        <CreateBoardCard
          data-testid="CreateBoardCard"
          onClick={() => setCreateOpen((prevState) => !prevState)}
        >
          Create new board
        </CreateBoardCard>
      </CreateBoardPopoverTrigger>

      <CreateBoardPopoverContent
        data-testid="CreateBoardPopoverContent"
        side="bottom"
      >
        <CreateBoardPopoverHeader data-testid="CreateBoardPopoverHeader">
          Create Board
          <PopoverClose
            data-testid="PopoverClose"
            onClick={() => setCreateOpen(false)}
          >
            X
          </PopoverClose>
        </CreateBoardPopoverHeader>

        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />

        <CreateBoardBackgroundText data-testid="CreateBoardBackgroundText">
          Background
        </CreateBoardBackgroundText>

        <CreateBoardBackgroundChoices data-testid="CreateBoardBackgroundChoices">
          {backgroundChoices.map((color) => (
            <CreateBoardBackgroundChoice
              data-testid="CreateBoardBackgroundChoice"
              key={color}
              background={color}
              onClick={() => setSelectedColor(color)}
            >
              {color === selectedColor && (
                <Center data-testid="Center">
                  <FaCheck />
                </Center>
              )}
            </CreateBoardBackgroundChoice>
          ))}
        </CreateBoardBackgroundChoices>

        <CreateBoardBackgroundText data-testid="CreateBoardBackgroundText">
          Board Title
        </CreateBoardBackgroundText>

        <CreateBoardTitleInput
          data-testid="CreateBoardTitleInput"
          onChange={(event) => setBoardTitle(event.target.value)}
          value={boardTitle}
          autoFocus
        />

        <CreateBoardButton
          data-testid="CreateBoardButton"
          disabled={!boardTitle}
          onClick={onBoardCreate}
        >
          Create
        </CreateBoardButton>
      </CreateBoardPopoverContent>
    </Popover.Root>
  );
}
