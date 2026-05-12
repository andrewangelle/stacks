import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import * as Fa from 'react-icons/fa';
import { useCreateBoardMutation } from '~/store/boardsApi';
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
} from '~/styles/Boards';

import { Center } from '~/styles/Page';

const backgroundChoices: BoardBackground[] = [
  'green',
  'lightGreen',
  'blue',
  'orange',
  'red',
];

type CreateBoardProps = {
  userId: string;
};

export function CreateBoard({ userId }: CreateBoardProps) {
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');
  const [boardTitle, setBoardTitle] = useState('');
  const [createBoard] = useCreateBoardMutation();

  function onBoardCreate() {
    if (!boardTitle || !userId) {
      return;
    }

    createBoard({
      boardColor: selectedColor,
      boardTitle,
      userId,
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
              background={color}
              onClick={() => setSelectedColor(color)}
            >
              {color === selectedColor && (
                <Center>
                  <Fa.FaCheck />
                </Center>
              )}
            </CreateBoardBackgroundChoice>
          ))}
        </CreateBoardBackgroundChoices>

        <CreateBoardBackgroundText>Board Title</CreateBoardBackgroundText>

        <CreateBoardTitleInput
          onChange={(event) => setBoardTitle(event.target.value)}
          value={boardTitle}
        />

        <CreateBoardButton isDisabled={!boardTitle} onClick={onBoardCreate}>
          Create
        </CreateBoardButton>
      </CreateBoardPopoverContent>
    </Popover.Root>
  );
}
