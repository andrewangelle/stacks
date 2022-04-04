import { useState } from 'react';
import * as Popover from '@radix-ui/react-popover';
import { BsCheck2Square } from 'react-icons/bs';
import { useRecoilState } from 'recoil';
import { useParams } from 'remix';

import { 
  CreateChecklistPopoverTrigger, 
  CardModalSiderButton, 
  CardModalSiderButtonText, 
  ChecklistPopoverContent, 
  ChecklistPopoverHeader, 
  PopoverClose, 
  CreateBoardCloseBorder, 
  CreateChecklistTitle, 
  CreateChecklistInput, 
  CreateChecklistAddButton
} from '~/styles';

import { useCreateChecklistMutation, tokenState, useCreateActivityMutation } from '~/store';

export function CreateChecklist({ listId, cardId }: { listId: string; cardId: string }){
  const params = useParams();
  const [token] = useRecoilState(tokenState)
  const [checklistTitle, setChecklistTitle] = useState('');
  const [createChecklist] = useCreateChecklistMutation();
  const [createActivity] = useCreateActivityMutation();
  return (
    <Popover.Root>
      <CreateChecklistPopoverTrigger>
        <CardModalSiderButton>
          <BsCheck2Square style={{marginRight: '4px'}} />
          <CardModalSiderButtonText>
            Checklist
          </CardModalSiderButtonText>
        </CardModalSiderButton>
      </CreateChecklistPopoverTrigger>

      <ChecklistPopoverContent>
        <ChecklistPopoverHeader>
          Add checklist
          <PopoverClose>
            X
          </PopoverClose>
        </ChecklistPopoverHeader>

        <CreateBoardCloseBorder />

        <CreateChecklistTitle>Title</CreateChecklistTitle>

        <CreateChecklistInput 
          value={checklistTitle}
          onChange={(event) => setChecklistTitle(event.target.value)}
        />

        <CreateChecklistAddButton
          onClick={() => {
            createChecklist({
              checklistTitle,
              cardId,
              listId,
              token: token?.access_token!,
              userId: token?.user.id!
            })
            createActivity({
              cardId,
              listId,
              boardId: params.id!,
              token: token?.access_token!,
              userId: token?.user.id!,
              type: 'feed',
              content: `added ${checklistTitle} to this card`
            })
          }}  
        >
          Add
        </CreateChecklistAddButton>
      </ChecklistPopoverContent>
    </Popover.Root>
  )
}