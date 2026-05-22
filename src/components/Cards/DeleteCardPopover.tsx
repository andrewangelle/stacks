import * as Popover from '@radix-ui/react-popover';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import {
  CardModalSiderButton,
  CardModalSiderButtonText,
  DeleteCardPopoverTrigger,
} from '~/components/Cards/CardModal.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
} from '~/components/Checklists/Checklists.styled';
import { type ListCardType, useDeleteCardMutation } from '~/query/cards';

type DeleteCardPopoverProps = ListCardType & {
  listId: string;
  listName: string;
};
export function DeleteCardPopover({
  id,
  listId,
  cardTitle,
}: DeleteCardPopoverProps) {
  const [deleteCard] = useDeleteCardMutation();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger data-testid="DeleteCardPopoverTrigger">
        <CardModalSiderButton data-testid="CardModalSiderButton">
          <CardModalSiderButtonText data-testid="CardModalSiderButtonText">
            Delete Card
          </CardModalSiderButtonText>
        </CardModalSiderButton>
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent data-testid="DeleteChecklistPopoverContent">
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          {`Delete ${cardTitle}`}
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />
        Deleting a card is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          data-testid="DeleteChecklistPopoverButton"
          onClick={() => {
            deleteCard({
              id,
              listId,
            });
          }}
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
