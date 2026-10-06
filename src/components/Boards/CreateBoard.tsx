import { Popover } from 'radix-ui';
import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import {
  type BoardBackground,
  CreateBoardBackgroundChoice,
  CreateBoardBackgroundChoices,
  CreateBoardCard,
  CreateBoardCloseBorder,
  CreateBoardPopoverTrigger,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  CreateBoardBackgroundText,
  CreateBoardButton,
  CreateBoardPopoverContent,
  CreateBoardPopoverHeader,
  CreateBoardTitleInput,
} from '~/components/Boards/CreateBoard.styled';
import { useCreateBoard } from '~/db/boards/boards.query';
import { Center } from '~/styles/Page.styled';
import { onEnter } from '~/utils/keyboard';

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

  function handleOpenChange(next: boolean) {
    setCreateOpen(next);

    if (!next) {
      setBoardTitle('');
      setSelectedColor('blue');
    }
  }

  function onBoardCreate() {
    if (!boardTitle) {
      return;
    }

    createBoard({
      boardColor: selectedColor,
      boardTitle,
    });

    handleOpenChange(false);
  }

  return (
    <Popover.Root open={isCreateOpen} onOpenChange={handleOpenChange}>
      <CreateBoardPopoverTrigger>
        <CreateBoardCard>Create new board</CreateBoardCard>
      </CreateBoardPopoverTrigger>

      <CreateBoardPopoverContent
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
        <CreateBoardPopoverHeader>
          Create board
          <PopoverClose>X</PopoverClose>
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
          onKeyDown={onEnter(onBoardCreate)}
        />

        <CreateBoardButton disabled={!boardTitle} onClick={onBoardCreate}>
          Create
        </CreateBoardButton>
      </CreateBoardPopoverContent>
    </Popover.Root>
  );
}
