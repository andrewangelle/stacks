import * as Popover from '@radix-ui/react-popover';
import { useAtom } from 'jotai';
import { type ListCardType, tokenState, useDeleteCardMutation } from '~/store';
import {
  CardModalSiderButton,
  CardModalSiderButtonText,
  ChecklistPopoverHeader,
  CreateBoardCloseBorder,
  DeleteCardPopoverTrigger,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  PopoverClose,
} from '~/styles';

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
