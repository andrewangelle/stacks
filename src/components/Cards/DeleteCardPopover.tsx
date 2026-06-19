import * as Popover from '@radix-ui/react-popover';
import { useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  CardModalActionButton,
  CardModalSiderButtonText,
  DeleteCardPopoverTrigger,
} from '~/components/Cards/Card.styled';
import { DeleteChecklistPopoverButton } from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { useDeleteCard, useGetCardById } from '~/query/cards';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function DeleteCardPopover() {
  const [open, setOpen] = useState(false);
  const id = useCurrentCardId();
  const boardId = useCurrentBoardId();
  const { data } = useGetCardById({ id });
  const deleteCard = useDeleteCard();
  const navigate = useNavigate();
  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <DeleteCardPopoverTrigger data-testid="DeleteCardPopoverTrigger">
        <CardModalActionButton data-testid="CardModalSiderButton" isOpen={open}>
          <CardModalSiderButtonText data-testid="CardModalSiderButtonText">
            Delete Card
          </CardModalSiderButtonText>
        </CardModalActionButton>
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent
        data-testid="DeleteChecklistPopoverContent"
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {`Delete ${data?.cardTitle ?? ''}`}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        {/** */}
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
        {/** */}
        Deleting a card is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
          onClick={() => {
            deleteCard({
              cardId: id,
              listId: data?.listId ?? '',
            });
            navigate({ to: '/board/$id', params: { id: boardId }, hash: '' });
          }}
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
