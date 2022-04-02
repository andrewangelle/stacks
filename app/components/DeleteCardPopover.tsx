import { useRecoilState } from "recoil";
import * as Popover from '@radix-ui/react-popover';

import { 
  DeleteChecklistPopoverContent, 
  ChecklistPopoverHeader, 
  CreateBoardCloseBorder, 
  DeleteChecklistPopoverButton, 
  PopoverClose,
  CardModalSiderButton,
  CardModalSiderButtonText,
  DeleteCardPopoverTrigger
} from "~/styles";

import { ListCardType, tokenState, useDeleteCardMutation } from "~/store";

export function DeleteCardPopover(
  props: ListCardType & {
    listId: string;
    listName: string;
  }
){
  const [token] = useRecoilState(tokenState);
  const [deleteCard] = useDeleteCardMutation();
  return (
    <Popover.Root>
      <DeleteCardPopoverTrigger>
        <CardModalSiderButton>
          <CardModalSiderButtonText>
            Delete Card
          </CardModalSiderButtonText>
        </CardModalSiderButton>
      </DeleteCardPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {`Delete ${props.cardTitle}`}
          <PopoverClose>
            X
          </PopoverClose>
        </ChecklistPopoverHeader>

        <CreateBoardCloseBorder />

        Deleting a card is permanent and there is no way to get it back.

        <DeleteChecklistPopoverButton 
          onClick={() => {
            deleteCard({
              id: props.id,
              listId: props.listId,
              token: token?.access_token!,
              userId: token?.user.id!
            })
          }}
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  )
}
