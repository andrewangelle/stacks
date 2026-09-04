import { Suspense, useRef } from 'react';
import { BoardSelect } from '~/components/Cards/MoveCardMenu/BoardSelect';
import { ListSelect } from '~/components/Cards/MoveCardMenu/ListSelect';
import {
  MoveCardButton,
  MoveCardFieldsContainer,
  MoveCardListColumn,
  MoveCardPositionColumn,
  MoveCardSelectRow,
  SelectSkeleton,
} from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import { PositionSelect } from '~/components/Cards/MoveCardMenu/PositionSelect';
import { useMoveCardMutation } from '~/db/cards/cards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useMoveCardSelectOptions } from '~/utils/useMoveCardSelectOptions';

type MoveCardFormProps = {
  id: string;
  onMoved?: () => void;
};

export function MoveCardForm({ id, onMoved }: MoveCardFormProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sourceBoardId = useCurrentBoardId();
  const { mutate: moveCard, isPending: isMovingCard } = useMoveCardMutation();
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

  const canMove = Boolean(
    currentListId && selectedList && !isListsLoading && selectionIsValid,
  );

  function handleMove() {
    if (canMove) {
      moveCard(
        {
          cardId: id,
          // biome-ignore lint/style/noNonNullAssertion: <it's clearly defined by the canMove check>
          sourceListId: currentListId!,
          targetListId: selectedList,
          targetIndex: selectedPosition - 1,
          sourceBoardId,
          targetBoardId: selectedBoardId,
        },
        { onSuccess: () => onMoved?.() },
      );
    }
  }

  return (
    <>
      <MoveCardFieldsContainer ref={ref}>
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

      <MoveCardButton onClick={handleMove} disabled={!canMove || isMovingCard}>
        Move
      </MoveCardButton>
    </>
  );
}
