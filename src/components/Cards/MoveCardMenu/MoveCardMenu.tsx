import * as Popover from '@radix-ui/react-popover';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { RxCaretDown } from 'react-icons/rx';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { BoardSelect } from '~/components/Cards/MoveCardMenu/BoardSelect';
import { ListSelect } from '~/components/Cards/MoveCardMenu/ListSelect';
import {
  DropdownLabel,
  MoveCardButton,
  MoveCardListColumn,
  MoveCardMenuContent,
  MoveCardMenuHeader,
  MoveCardMenuTrigger,
  MoveCardPositionColumn,
  MoveCardSelectRow,
} from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import { PositionSelect } from '~/components/Cards/MoveCardMenu/PositionSelect';
import { useMoveCardMutation } from '~/db/cards/cards.query';
import { useGetListByCardId } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useMoveCardSelectOptions } from '~/utils/useMoveCardSelectOptions';

export function MoveCardMenu({ id }: { id: string }) {
  const [open, setOpen] = useState(false);
  const { data: list } = useGetListByCardId({ id });
  const ref = useRef<HTMLDivElement>(null);
  const sourceBoardId = useCurrentBoardId();
  const navigate = useNavigate();
  const {
    mutate: moveCard,
    isSuccess: isCardMoved,
    isPending: isMovingCard,
  } = useMoveCardMutation();
  const {
    isListsLoading,
    selectedBoardId,
    lists,
    currentListId,
    selectedList,
    positions,
    selectedPosition,
    setSelectedBoardId,
    setSelectedList,
    setSelectedPosition,
  } = useMoveCardSelectOptions({ cardId: id });

  // Any board/list/position selection is a valid move; only wait for the list
  // selection to resolve.
  const canMove = Boolean(currentListId && selectedList);

  function handleMove() {
    if (canMove) {
      moveCard({
        cardId: id,
        // biome-ignore lint/style/noNonNullAssertion: <it's clearly defined by the canMove check>
        sourceListId: currentListId!,
        targetListId: selectedList,
        targetIndex: selectedPosition - 1,
        sourceBoardId,
        targetBoardId: selectedBoardId,
      });
    }
  }

  // Close the card modal once the move has persisted.
  useEffect(() => {
    if (isCardMoved) {
      navigate({
        to: '/board/$id',
        params: { id: sourceBoardId },
        hash: '',
        search: { from: `card-${id}` },
      });
    }
  }, [isCardMoved, navigate, sourceBoardId, id]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <MoveCardMenuTrigger data-testid="MoveCardMenuTrigger">
        {list?.listTitle}
        <RxCaretDown size={20} data-testid="RxCaretDown" />
      </MoveCardMenuTrigger>

      <MoveCardMenuContent
        data-testid="MoveCardMenuContent"
        side="bottom"
        align="start"
        sideOffset={8}
        alignOffset={4}
      >
        <MoveCardMenuHeader data-testid="MoveCardMenuHeader">
          Move card
          <PopoverClose data-testid="PopoverClose">X</PopoverClose>
        </MoveCardMenuHeader>

        <CreateBoardCloseBorder data-testid="CreateBoardCloseBorder" />

        <div ref={ref}>
          <DropdownLabel data-testid="BoardSelectTitle">Board</DropdownLabel>

          <BoardSelect
            cardId={id}
            ref={ref}
            selectedBoardId={selectedBoardId}
            setSelectedBoardId={setSelectedBoardId}
          />

          <MoveCardSelectRow>
            <MoveCardListColumn>
              <DropdownLabel data-testid="ListSelectTitle">List</DropdownLabel>

              <ListSelect
                ref={ref}
                isListsLoading={isListsLoading}
                lists={lists}
                currentListId={currentListId}
                selectedList={selectedList}
                setSelectedList={setSelectedList}
              />
            </MoveCardListColumn>

            <MoveCardPositionColumn>
              <DropdownLabel data-testid="PositionSelectTitle">
                Position
              </DropdownLabel>

              <PositionSelect
                ref={ref}
                positions={positions}
                selectedPosition={selectedPosition}
                setSelectedPosition={setSelectedPosition}
              />
            </MoveCardPositionColumn>
          </MoveCardSelectRow>
        </div>

        <MoveCardButton
          data-testid="MoveCardButton"
          onClick={handleMove}
          disabled={!canMove || isMovingCard}
        >
          Move
        </MoveCardButton>
      </MoveCardMenuContent>
    </Popover.Root>
  );
}
