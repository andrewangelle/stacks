import { useNavigate } from '@tanstack/react-router';
import { Suspense, useEffect, useRef } from 'react';
import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
import { BoardSelect } from '~/components/Cards/MoveCardMenu/BoardSelect';
import { ListSelect } from '~/components/Cards/MoveCardMenu/ListSelect';
import {
  MoveCardButton,
  MoveCardFieldsContainer,
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
    selectionIsValid,
    positions,
    selectedPosition,
    setSelectedBoardId,
    setSelectedList,
    setSelectedPosition,
  } = useMoveCardSelectOptions({ cardId: id });

  // Any board/list/position selection is a valid move, but after a board switch
  // the lists still reload and selectedList briefly points at the old board's
  // list. Wait for the selection to re-anchor onto the loaded lists so the
  // button doesn't submit a stale selection mid-load.
  const canMove = Boolean(
    currentListId && selectedList && !isListsLoading && selectionIsValid,
  );

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

      <MoveCardFieldsContainer ref={ref} data-testid="MoveCardFieldsContainer">
        <Suspense fallback={<SelectSkeleton style={{ minHeight: '44px' }} />}>
          <BoardSelect
            cardId={id}
            ref={ref}
            selectedBoardId={selectedBoardId}
            setSelectedBoardId={setSelectedBoardId}
          />
        </Suspense>

        <MoveCardSelectRow data-testid="MoveCardSelectRow">
          <MoveCardListColumn data-testid="MoveCardListColumn">
            <ListSelect
              ref={ref}
              isListsLoading={isListsLoading}
              lists={lists}
              currentListId={currentListId}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />
          </MoveCardListColumn>

          <MoveCardPositionColumn data-testid="MoveCardPositionColumn">
            <PositionSelect
              ref={ref}
              selectedList={selectedList}
              isListsLoading={isListsLoading}
              positions={positions}
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
            />
          </MoveCardPositionColumn>
        </MoveCardSelectRow>
      </MoveCardFieldsContainer>

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
