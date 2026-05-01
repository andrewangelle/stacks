import * as Popover from '@radix-ui/react-popover';
import { useAtom } from 'jotai';
import { tokenState } from '~/store/atoms';
import { type ListCardType, useDeleteCardMutation } from '~/store/cardsApi';
import { CreateBoardCloseBorder, PopoverClose } from '~/styles/Boards';
import {
  CardModalSiderButton,
  CardModalSiderButtonText,
  ChecklistPopoverHeader,
  DeleteCardPopoverTrigger,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
} from '~/styles/CardModal';

export function DeleteCardPopover(
  props: ListCardType & {
    listId: string;
    listName: string;
  },
) {
  const [token] = useAtom(tokenState);
  const [deleteCard] = useDeleteCardMutation();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger>
        <CardModalSiderButton>
          <CardModalSiderButtonText>Delete Card</CardModalSiderButtonText>
        </CardModalSiderButton>
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {`Delete ${props.cardTitle}`}
          <PopoverClose>X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder />
        Deleting a card is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          onClick={() => {
            deleteCard({
              id: props.id,
              listId: props.listId,
              token: token?.access_token ?? '',
              userId: token?.user.id ?? '',
            });
          }}
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
