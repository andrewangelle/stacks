import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { BsCheck2Square } from 'react-icons/bs';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  CardModalActionButton,
  CardModalSiderButtonText,
  CreateChecklistPopoverTrigger,
} from '~/components/Cards/Card.styled';
import {
  ChecklistPopoverContent,
  ChecklistPopoverHeader,
  CreateChecklistAddButton,
  CreateChecklistInput,
  CreateChecklistTitle,
} from '~/components/Checklists/Checklists.styled';
import { Tooltip } from '~/components/Tooltip/Tooltip';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useGetCardById } from '~/db/cards/cards.query';
import { useCreateChecklist } from '~/db/checklists/checklists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CreateChecklist() {
  const [open, setOpen] = useState(false);
  const cardId = useCurrentCardId();
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

    setChecklistTitle('');
    setOpen(false);
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <CreateChecklistPopoverTrigger data-testid="CreateChecklistPopoverTrigger">
        <Tooltip portal={false} content="Create checklist">
          <CardModalActionButton
            data-testid="CardModalActionButton"
            isOpen={open}
          >
            <BsCheck2Square
              style={{ marginRight: '4px', position: 'relative', top: '2px' }}
            />
            <CardModalSiderButtonText data-testid="CardModalSiderButtonText">
              Checklist
            </CardModalSiderButtonText>
          </CardModalActionButton>
        </Tooltip>
      </CreateChecklistPopoverTrigger>

      <ChecklistPopoverContent
        data-testid="ChecklistPopoverContent"
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
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
