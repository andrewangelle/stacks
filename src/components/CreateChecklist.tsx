import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import { BsCheck2Square } from 'react-icons/bs';
import { useCreateActivityMutation } from '~/store/activityApi';
import { tokenState } from '~/store/atoms';
import { useCreateChecklistMutation } from '~/store/checklistsApi';
import {
  CardModalSiderButton,
  CardModalSiderButtonText,
  ChecklistPopoverContent,
  ChecklistPopoverHeader,
  CreateBoardCloseBorder,
  CreateChecklistAddButton,
  CreateChecklistInput,
  CreateChecklistPopoverTrigger,
  CreateChecklistTitle,
  PopoverClose,
} from '~/styles/CardModal';

export function CreateChecklist({
  listId,
  cardId,
}: {
  listId: string;
  cardId: string;
}) {
  const params = useParams({ strict: false });
  const [token] = useAtom(tokenState);
  const [checklistTitle, setChecklistTitle] = useState('');
  const [createChecklist] = useCreateChecklistMutation();
  const [createActivity] = useCreateActivityMutation();
  return (
    <Popover.Root>
      <CreateChecklistPopoverTrigger>
        <CardModalSiderButton>
          <BsCheck2Square style={{ marginRight: '4px' }} />
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

        <CreateChecklistAddButton
          onClick={() => {
            createChecklist({
              checklistTitle,
              cardId,
              listId,
              token: token?.access_token ?? '',
              userId: token?.user.id ?? '',
            });
            createActivity({
              cardId,
              listId,
              boardId: params.id ?? '',
              token: token?.access_token ?? '',
              userId: token?.user.id ?? '',
              type: 'feed',
              content: `added ${checklistTitle} to this card`,
            });
          }}
        >
          Add
        </CreateChecklistAddButton>
      </ChecklistPopoverContent>
    </Popover.Root>
  );
}
