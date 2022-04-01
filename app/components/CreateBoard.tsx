import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { FaCheck } from 'react-icons/fa'
import { useRecoilState } from 'recoil';

import { 
  CreateBoardCard, 
  CreateBoardPopoverTrigger, 
  CreateBoardPopoverContent, 
  PopoverClose, 
  CreateBoardCloseBorder, 
  CreateBoardPopoverHeader, 
  CreateBoardBackgroundText,
  lightGreen,
  blue,
  green,
  orange,
  red,
  CreateBoardBackgroundChoice,
  CreateBoardBackgroundChoices,
  Center,
  CreateBoardTitleInput,
  CreateBoardButton
} from '~/styles';
import { tokenState, useCreateBoardMutation } from '~/store';

const backgroundChoices = [
  green,
  lightGreen,
  blue,
  orange, 
  red,
];

export function CreateBoard(){
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedColor, setSelectedColor] = useState(blue);
  const [boardTitle, setBoardTitle] = useState('');
  const [token] = useRecoilState(tokenState);
  const [createBoard] = useCreateBoardMutation();

  function onBoardCreate(){
    createBoard({
      boardColor: selectedColor, 
      boardTitle,
      token: token!.access_token,
      userId: token!.user.id as string
    })
  }
  
  return (
    <Popover.Root open={isCreateOpen}>
      <CreateBoardPopoverTrigger>
        <CreateBoardCard onClick={() => setCreateOpen(prevState => !prevState)}>
          Create new board
        </CreateBoardCard>
      </CreateBoardPopoverTrigger>

      <CreateBoardPopoverContent side="bottom" sideOffset={-100}>
        <CreateBoardPopoverHeader>
          Create Board
          <PopoverClose onClick={() => setCreateOpen(false)}>
            X
          </PopoverClose>
        </CreateBoardPopoverHeader>

        <CreateBoardCloseBorder />

        <CreateBoardBackgroundText>Background</CreateBoardBackgroundText>
        <CreateBoardBackgroundChoices>
          {backgroundChoices.map(color => 
            <CreateBoardBackgroundChoice 
              key={color} 
              background={color}
              onClick={() => setSelectedColor(color)}
            >
              {color === selectedColor && (
                <Center>
                  <FaCheck />
                </Center>
              )}
            </CreateBoardBackgroundChoice>
          )}
        </CreateBoardBackgroundChoices>

        <CreateBoardBackgroundText>Board Title</CreateBoardBackgroundText>

        <CreateBoardTitleInput 
          onChange={(event) => setBoardTitle(event.target.value)}
          value={boardTitle}
        />
 
        <CreateBoardButton 
          isDisabled={!boardTitle}
          onClick={onBoardCreate}
        >
          Create
        </CreateBoardButton>
      </CreateBoardPopoverContent>
    </Popover.Root>
  )
}