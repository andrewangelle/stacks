import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import * as Fa from 'react-icons/fa';
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
import { useCreateBoardMutation } from '~/query/boards';

import { Center } from '~/styles/Page.styled';

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
                  <Fa.FaCheck />
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
          isDisabled={!boardTitle}
          onClick={onBoardCreate}
        >
          Create
        </CreateBoardButton>
      </CreateBoardPopoverContent>
    </Popover.Root>
  );
}
