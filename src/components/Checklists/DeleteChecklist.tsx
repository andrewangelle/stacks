import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { PopoverClose } from '~/components/Boards/Boards.styled';
import {
  DeleteChecklistPopoverButton,
  DeleteChecklistPopoverTrigger,
} from '~/components/ChecklistItem/ChecklistItem.styled';
import {
  ChecklistPopoverHeader,
  DeleteChecklistButton,
} from '~/components/Checklists/Checklists.styled';
import { useCreateActivity } from '~/db/activity/activity.query';
import {
  useDeleteChecklist,
  useGetChecklist,
} from '~/db/checklists/checklists.query';
import {
  PopoverOptionsContent,
  PopoverOptionsContentContainer,
} from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function DeleteChecklist({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { data: checklist } = useGetChecklist({ checklistId: id });
  const deleteChecklist = useDeleteChecklist();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  function applyDelete() {
    if (checklist) {
      deleteChecklist({
        checklistId: id,
        cardId: checklist.cardId,
      });

      createActivity({
        cardId: checklist.cardId,
        listId: checklist.listId,
        boardId,
        type: 'feed',
        content: `removed ${checklist.checklistTitle} from this card`,
      });
    }
  }

  if (!checklist) return null;

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <DeleteChecklistPopoverTrigger data-testid="DeleteChecklistPopoverTrigger">
        <DeleteChecklistButton
          data-testid="DeleteChecklistButton"
          isOpen={open}
        >
          Delete
        </DeleteChecklistButton>
      </DeleteChecklistPopoverTrigger>

      <PopoverOptionsContent
        data-testid="PopoverOptionsContent"
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
        <ChecklistPopoverHeader data-testid="ChecklistPopoverHeader">
          <div
            style={{ fontWeight: 600 }}
          >{`Delete ${checklist.checklistTitle}?`}</div>
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </ChecklistPopoverHeader>

        <PopoverOptionsContentContainer>
          Deleting a checklist is permanent and there is no way to get it back.
          <DeleteChecklistPopoverButton
            data-testid="DeleteChecklistPopoverButton"
            onClick={applyDelete}
          >
            Delete checklist
          </DeleteChecklistPopoverButton>
        </PopoverOptionsContentContainer>
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
