import { useNavigate } from '@tanstack/react-router';
import { Suspense, useEffect, useRef } from 'react';
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
  MoveCardPositionColumn,
  MoveCardSelectRow,
  SelectSkeleton,
} from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import { PositionSelect } from '~/components/Cards/MoveCardMenu/PositionSelect';
import { useMoveCardMutation } from '~/db/cards/cards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useMoveCardSelectOptions } from '~/utils/useMoveCardSelectOptions';

export function MoveCardFields({ id }: { id: string }) {
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

        <Suspense fallback={<SelectSkeleton style={{ minHeight: '44px' }} />}>
          <BoardSelect
            cardId={id}
            ref={ref}
            selectedBoardId={selectedBoardId}
            setSelectedBoardId={setSelectedBoardId}
          />
        </Suspense>

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
              isListsLoading={isListsLoading}
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
  );
}
