import { useNavigate } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import { useState } from 'react';
import { PopoverClose } from '~/components/Boards/Boards.styled';
import {
  CardModalActionButton,
  CardModalSiderButtonText,
  DeleteCardPopoverTrigger,
} from '~/components/Cards/Card.styled';
import { DeleteChecklistPopoverButton } from '~/components/ChecklistItem/ChecklistItem.styled';
import { ChecklistPopoverHeader } from '~/components/Checklists/Checklists.styled';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useDeleteCard, useGetCardById } from '~/db/cards/cards.query';
import {
  PopoverOptionsContent,
  PopoverOptionsContentContainer,
} from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function DeleteCardPopover() {
  const [open, setOpen] = useState(false);
  const id = useCurrentCardId();
  const boardId = useCurrentBoardId();
  const { data } = useGetCardById({ id });
  const deleteCard = useDeleteCard();
  const navigate = useNavigate();

  function applyDelete() {
    deleteCard({
      cardId: id,
      listId: data?.listId ?? '',
    });
    navigate({ to: '/board/$id', params: { id: boardId }, hash: '' });
  }

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <DeleteCardPopoverTrigger data-testid="DeleteCardPopoverTrigger">
        <Tooltip portal={false} content="Delete card">
          <CardModalActionButton
            data-testid="CardModalSiderButton"
            isOpen={open}
          >
            <CardModalSiderButtonText data-testid="CardModalSiderButtonText">
              Delete Card
            </CardModalSiderButtonText>
          </CardModalActionButton>
        </Tooltip>
      </DeleteCardPopoverTrigger>

      <PopoverOptionsContent
        data-testid="PopoverOptionsContent"
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          <div style={{ fontWeight: 600 }}>
            {`Delete ${data?.cardTitle ?? ''}?`}
          </div>
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>

        <PopoverOptionsContentContainer>
          Deleting a card is permanent and there is no way to get it back.
          <DeleteChecklistPopoverButton
            data-testid="DeleteChecklistPopoverButton"
            onClick={applyDelete}
          >
            Delete card
          </DeleteChecklistPopoverButton>
        </PopoverOptionsContentContainer>
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
