import { useRecoilState } from "recoil";
import * as Popover from '@radix-ui/react-popover';

import { 
  DeleteChecklistPopoverTrigger, 
  DeleteChecklistPopoverContent, 
  ChecklistPopoverHeader, 
  CreateBoardCloseBorder, 
  DeleteChecklistPopoverButton, 
  PopoverClose
} from "~/styles";

import { ActivityType, tokenState, useDeleteActivityMutation } from "~/store";

export function DeleteCommentPopover(
  props: ActivityType
){
  const [token] = useRecoilState(tokenState);
  const [deleteActivity] = useDeleteActivityMutation();
  return (
    <Popover.Root>
      <DeleteChecklistPopoverTrigger>
        <div 
          style={{
            textDecoration: 'underline', 
            marginLeft: '4px',
            cursor: 'pointer'
          }}
        >
          Delete
        </div>
      </DeleteChecklistPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {`Delete comment`}
          <PopoverClose>
            X
          </PopoverClose>
        </ChecklistPopoverHeader>

        <CreateBoardCloseBorder />

        Deleting a comment is permanent and there is no way to get it back.

        <DeleteChecklistPopoverButton 
          onClick={() => 
            deleteActivity({
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
