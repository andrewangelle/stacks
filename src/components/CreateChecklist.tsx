import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import { useCreateActivityMutation } from '~/query/activityApi';
import { useCreateChecklistMutation } from '~/query/checklistsApi';
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
      <CreateChecklistPopoverTrigger data-testid="CreateChecklistPopoverTrigger">
        <CardModalSiderButton data-testid="CardModalSiderButton">
          <Bs.BsCheck2Square style={{ marginRight: '4px' }} />
          <CardModalSiderButtonText data-testid="CardModalSiderButtonText">
            Checklist
          </CardModalSiderButtonText>
        </CardModalSiderButton>
      </CreateChecklistPopoverTrigger>

      <ChecklistPopoverContent data-testid="ChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          Add checklist
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>

        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />

        <CreateChecklistTitle data-testid="CreateChecklistTitle">
          Title
        </CreateChecklistTitle>

        <CreateChecklistInput
          data-testid="CreateChecklistInput"
          value={checklistTitle}
          onChange={(event) => setChecklistTitle(event.target.value)}
        />

        <CreateChecklistAddButton
          data-testid="CreateChecklistAddButton"
          onClick={addChecklist}
        >
          Add
        </CreateChecklistAddButton>
      </ChecklistPopoverContent>
    </Popover.Root>
  );
}
