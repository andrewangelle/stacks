import * as Popover from '@radix-ui/react-popover';
import {
  type ActivityType,
  useDeleteActivityMutation,
} from '~/store/activityApi';
import { CreateBoardCloseBorder, PopoverClose } from '~/styles/Boards';
import {
  ChecklistPopoverHeader,
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverContent,
  DeleteChecklistPopoverTrigger,
} from '~/styles/CardModal';

export function DeleteCommentPopover(props: ActivityType) {
  const [deleteActivity] = useDeleteActivityMutation();
  return (
    <Popover.Root>
      <DeleteChecklistPopoverTrigger>
        <div
          style={{
            textDecoration: 'underline',
            marginLeft: '4px',
            cursor: 'pointer',
          }}
        >
          Delete
        </div>
      </DeleteChecklistPopoverTrigger>

      <DeleteChecklistPopoverContent>
        <ChecklistPopoverHeader>
          {'Delete comment'}
          <PopoverClose>X</PopoverClose>
        </ChecklistPopoverHeader>
        <CreateBoardCloseBorder />
        Deleting a comment is permanent and there is no way to get it back.
        <DeleteChecklistPopoverButton
          onClick={() =>
            deleteActivity({
              id: props.id,
              cardId: props.cardId,
            })
          }
        >
          Delete
        </DeleteChecklistPopoverButton>
      </DeleteChecklistPopoverContent>
    </Popover.Root>
  );
}
