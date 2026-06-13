import * as Popover from '@radix-ui/react-popover';
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
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function DeleteCardPopover() {
  const id = useCurrentCardId();
  const { data } = useGetCardById({ id });
  const deleteCard = useDeleteCard();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger data-testid="DeleteCardPopoverTrigger">
        <CardModalActionButton data-testid="CardModalSiderButton">
          <CardModalSiderButtonText data-testid="CardModalSiderButtonText">
            Delete Card
          </CardModalSiderButtonText>
        </CardModalActionButton>
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {`Delete ${data?.cardTitle ?? ''}`}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
        Deleting a card is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
          onClick={() => {
            deleteCard({
              cardId: id,
              listId: data?.listId ?? '',
            });
          }}
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
