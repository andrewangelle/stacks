import { Popover } from 'radix-ui';
import { useState } from 'react';
import {
  DeleteListButton,
  ListActionsOption,
  ListActionsOptionsContainer,
  ListActionsPopoverButton,
  ListActionsPopoverButtonBack,
  ListActionsPopoverButtonText,
  ListActionsPopoverClose,
  ListActionsPopoverHeader,
  ListActionsPopoverTrigger,
} from '~/components/Lists/ListActions/ListActions.styled';
import { MoveListMenu } from '~/components/Lists/ListActions/MoveListMenu';
import { Tooltip } from '~/components/Tooltip/Tooltip';
import { useDeleteList } from '~/db/lists/lists.query';
import {
  PopoverOptionsContent,
  PopoverOptionsContentContainer,
} from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type ListActionsProps = {
  id: string;
};

type Views = 'actions' | 'move' | 'delete';

const viewTitles: Record<Views, string> = {
  actions: 'List actions',
  move: 'Move list',
  delete: 'Are you sure?',
};

export function ListActions({ id }: ListActionsProps) {
  const boardId = useCurrentBoardId();
  const deleteList = useDeleteList();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Views>('actions');

  function closePopover(open: boolean) {
    setOpen(open);
    setView('actions');
  }

  return (
    <Popover.Root open={open} onOpenChange={closePopover}>
      <ListActionsPopoverTrigger data-testid="ListActionsPopoverTrigger">
        <Tooltip portal={true} content="List actions">
          <ListActionsPopoverButton
            data-testid="ListActionsPopoverButton"
            isOpen={open}
          >
            <ListActionsPopoverButtonText data-testid="ListActionsPopoverButtonText">
              ...
            </ListActionsPopoverButtonText>
          </ListActionsPopoverButton>
        </Tooltip>
      </ListActionsPopoverTrigger>

      <PopoverOptionsContent data-testid="PopoverOptionsContent">
        <ListActionsPopoverHeader data-testid="ListActionsPopoverHeader">
          <div>
            <ListActionsPopoverButtonBack
              tabIndex={view !== 'actions' ? 0 : -1}
              isActive={view !== 'actions'}
              onClick={() => setView('actions')}
            >
              {view !== 'actions' ? '<' : ''}
            </ListActionsPopoverButtonBack>
          </div>

          <div>{viewTitles[view]}</div>

          <ListActionsPopoverClose data-testid="ListActionsPopoverClose">
            X
          </ListActionsPopoverClose>
        </ListActionsPopoverHeader>

        {view === 'actions' && (
          <ListActionsOptionsContainer data-testid="ListActionsOptionsContainer">
            <ListActionsOption
              data-testid="ListActionsOption"
              onClick={() => setView('move')}
            >
              Move list
            </ListActionsOption>

            <ListActionsOption
              data-testid="ListActionsOption"
              onClick={() => setView('delete')}
            >
              Archive this list
            </ListActionsOption>
          </ListActionsOptionsContainer>
        )}

        {view === 'move' && (
          <MoveListMenu id={id} onMoved={() => closePopover(false)} />
        )}

        {view === 'delete' && (
          <PopoverOptionsContentContainer>
            This list will be deleted
            <DeleteListButton
              data-testid="DeleteListButton"
              onClick={() =>
                deleteList({
                  listId: id,
                  boardId,
                })
              }
            >
              Delete list
            </DeleteListButton>
          </PopoverOptionsContentContainer>
        )}
      </PopoverOptionsContent>
    </Popover.Root>
  );
}
