import { useRecoilState } from "recoil";
import * as Popover from '@radix-ui/react-popover';

import { 
  DeleteChecklistPopoverTrigger, 
  DeleteChecklistButton, 
  DeleteChecklistPopoverContent, 
  ChecklistPopoverHeader, 
  CreateBoardCloseBorder, 
  DeleteChecklistPopoverButton, 
  PopoverClose
} from "~/styles";

import { ChecklistType, tokenState, useDeleteChecklistMutation } from "~/store";

export function DeleteChecklistPopover(
  props: ChecklistType
){
  const [token] = useRecoilState(tokenState);
  const [deleteChecklist] = useDeleteChecklistMutation();
  return (
    <Popover.Root>
      <DeleteChecklistPopoverTrigger>
        <DeleteChecklistButton secondary>
          Delete
        </DeleteChecklistButton>
      </DeleteChecklistPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {`Delete ${props.checklistTitle}`}
          <PopoverClose>
            X
          </PopoverClose>
        </ChecklistPopoverHeader>

        <CreateBoardCloseBorder />

        Deleting a checklist is permanent and there is no way to get it back.

        <DeleteChecklistPopoverButton 
          onClick={() => 
            deleteChecklist({
              token: token?.access_token!,
              id: props.id,
              cardId: props.cardId
            })
          }
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  )
}
