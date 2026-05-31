import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  CardModalActionButton,
  CardModalSiderButtonText,
  CreateChecklistPopoverTrigger,
} from '~/components/Cards/CardModal.styled';
import {
  ChecklistPopoverContent,
  ChecklistPopoverHeader,
  CreateChecklistAddButton,
  CreateChecklistInput,
  CreateChecklistTitle,
} from '~/components/Checklists/Checklists.styled';
import { useCreateActivity } from '~/query/activity';
import { useGetCardById } from '~/query/cards';
import { useCreateChecklist } from '~/query/checklists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type CreateChecklistProps = {
  cardId: string;
};

export function CreateChecklist({ cardId }: CreateChecklistProps) {
  const boardId = useCurrentBoardId();
  const { data } = useGetCardById({ id: cardId });

  const [checklistTitle, setChecklistTitle] = useState('');
  const createChecklist = useCreateChecklist();
  const createActivity = useCreateActivity();

  function addChecklist() {
    createChecklist({
      checklistTitle,
      cardId,
      listId: data?.listId ?? '',
    });

    createActivity({
      cardId,
      listId: data?.listId ?? '',
      boardId,
      type: 'feed',
      content: `added ${checklistTitle} to this card`,
    });
  }

  return (
    <Popover.Root>
      <CreateChecklistPopoverTrigger data-testid="CreateChecklistPopoverTrigger">
        <CardModalActionButton data-testid="CardModalActionButton">
          <Bs.BsCheck2Square style={{ marginRight: '4px' }} />
          <CardModalSiderButtonText data-testid="CardModalSiderButtonText">
            Checklist
          </CardModalSiderButtonText>
        </CardModalActionButton>
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
          autoFocus
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
