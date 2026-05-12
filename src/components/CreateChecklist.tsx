import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import { useCreateActivityMutation } from '~/store/activityApi';
import { useCreateChecklistMutation } from '~/store/checklistsApi';
import { CreateBoardCloseBorder, PopoverClose } from '~/styles/Boards';
import {
  CardModalSiderButton,
  CardModalSiderButtonText,
  ChecklistPopoverContent,
  ChecklistPopoverHeader,
  CreateChecklistAddButton,
  CreateChecklistInput,
  CreateChecklistPopoverTrigger,
  CreateChecklistTitle,
} from '~/styles/CardModal';

type CreateChecklistProps = {
  listId: string;
  cardId: string;
};

export function CreateChecklist({ listId, cardId }: CreateChecklistProps) {
  const params = useParams({ strict: false });
  const [checklistTitle, setChecklistTitle] = useState('');
  const [createChecklist] = useCreateChecklistMutation();
  const [createActivity] = useCreateActivityMutation();

  function addChecklist() {
    createChecklist({
      checklistTitle,
      cardId,
      listId,
    });

    createActivity({
      cardId,
      listId,
      boardId: params.id ?? '',
      type: 'feed',
      content: `added ${checklistTitle} to this card`,
    });
  }

  return (
    <Popover.Root>
      <CreateChecklistPopoverTrigger>
        <CardModalSiderButton>
          <Bs.BsCheck2Square style={{ marginRight: '4px' }} />
          <CardModalSiderButtonText>Checklist</CardModalSiderButtonText>
        </CardModalSiderButton>
      </CreateChecklistPopoverTrigger>

      <ChecklistPopoverContent>
        <ChecklistPopoverHeader>
          Add checklist
          <PopoverClose>X</PopoverClose>
        </ChecklistPopoverHeader>

        <CreateBoardCloseBorder />

        <CreateChecklistTitle>Title</CreateChecklistTitle>

        <CreateChecklistInput
          value={checklistTitle}
          onChange={(event) => setChecklistTitle(event.target.value)}
        />

        <CreateChecklistAddButton onClick={addChecklist}>
          Add
        </CreateChecklistAddButton>
      </ChecklistPopoverContent>
    </Popover.Root>
  );
}
