import { useNavigate } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import { Suspense, useEffect, useRef } from 'react';
import * as boardsStyles from '~/components/Boards/Boards.css';
import { BoardSelect } from '~/components/Cards/MoveCardMenu/BoardSelect';
import { ListSelect } from '~/components/Cards/MoveCardMenu/ListSelect';
import * as moveCardMenuStyles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';
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
    <Popover.Content
      className={moveCardMenuStyles.moveCardMenuContent}
      data-testid="MoveCardMenuContent"
      side="bottom"
      align="start"
      sideOffset={8}
      alignOffset={4}
    >
      <div
        className={moveCardMenuStyles.moveCardMenuHeader}
        data-testid="MoveCardMenuHeader"
      >
        Move card
        <Popover.Close
          className={boardsStyles.popoverClose}
          data-testid="PopoverClose"
        >
          X
        </Popover.Close>
      </div>

      <hr
        className={boardsStyles.createBoardCloseBorder}
        data-testid="CreateBoardCloseBorder"
      />

      <div
        className={moveCardMenuStyles.moveCardFieldsContainer}
        ref={ref}
        data-testid="MoveCardFieldsContainer"
      >
        <Suspense
          fallback={
            <div
              className={moveCardMenuStyles.selectSkeleton}
              style={{ minHeight: '44px' }}
            />
          }
        >
          <BoardSelect
            cardId={id}
            ref={ref}
            selectedBoardId={selectedBoardId}
            setSelectedBoardId={setSelectedBoardId}
          />
        </Suspense>

        <div
          className={moveCardMenuStyles.moveCardSelectRow}
          data-testid="MoveCardSelectRow"
        >
          <div
            className={moveCardMenuStyles.moveCardListColumn}
            data-testid="MoveCardListColumn"
          >
            <ListSelect
              ref={ref}
              isListsLoading={isListsLoading}
              lists={lists}
              currentListId={currentListId}
              selectedList={selectedList}
              setSelectedList={setSelectedList}
            />
          </div>

          <div
            className={moveCardMenuStyles.moveCardPositionColumn}
            data-testid="MoveCardPositionColumn"
          >
            <PositionSelect
              ref={ref}
              selectedList={selectedList}
              isListsLoading={isListsLoading}
              positions={positions}
              selectedPosition={selectedPosition}
              setSelectedPosition={setSelectedPosition}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={moveCardMenuStyles.moveCardButton}
        data-testid="MoveCardButton"
        onClick={handleMove}
        disabled={!canMove || isMovingCard}
      >
        Move
      </button>
    </Popover.Content>
  );
}
