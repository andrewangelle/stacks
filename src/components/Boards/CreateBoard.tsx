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
      <CreateBoardPopoverTrigger>
        <CreateBoardCard
          onClick={() => setCreateOpen((prevState) => !prevState)}
        >
          Create new board
        </CreateBoardCard>
      </CreateBoardPopoverTrigger>

      <CreateBoardPopoverContent side="bottom">
        <CreateBoardPopoverHeader>
          Create Board
          <PopoverClose onClick={() => setCreateOpen(false)}>X</PopoverClose>
        </CreateBoardPopoverHeader>

        <CreateBoardCloseBorder />

        <CreateBoardBackgroundText>Background</CreateBoardBackgroundText>

        <CreateBoardBackgroundChoices>
          {backgroundChoices.map((color) => (
            <CreateBoardBackgroundChoice
              key={color}
              $background={color}
              onClick={() => setSelectedColor(color)}
            >
              {color === selectedColor && (
                <Center>
                  <FaCheck />
                </Center>
              )}
            </CreateBoardBackgroundChoice>
          ))}
        </CreateBoardBackgroundChoices>

        <CreateBoardBackgroundText>Board Title</CreateBoardBackgroundText>

        <CreateBoardTitleInput
          onChange={(event) => setBoardTitle(event.target.value)}
          value={boardTitle}
          autoFocus
        />

        <CreateBoardButton disabled={!boardTitle} onClick={onBoardCreate}>
          Create
        </CreateBoardButton>
      </CreateBoardPopoverContent>
    </Popover.Root>
  );
}
