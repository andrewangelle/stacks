import * as Popover from '@radix-ui/react-popover';
import { useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import { useCreateActivityMutation } from '~/store/activityApi';
import { tokenState } from '~/store/atoms';
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
  const [token] = useAtom(tokenState);
  const [checklistTitle, setChecklistTitle] = useState('');
  const [createChecklist] = useCreateChecklistMutation();
  const [createActivity] = useCreateActivityMutation();
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
