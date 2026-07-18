import { Suspense } from 'react';
import { SelectSkeleton } from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import {
  ComboboxLabel,
  ComboboxWrapper,
} from '~/components/Combobox/Combobox.styled';
import {
  MoveListButton,
  MoveListFieldsContainer,
} from '~/components/Lists/ListActions/ListActions.styled';
import { MoveListBoardSelect } from '~/components/Lists/ListActions/MoveListBoardSelect';
import { MoveListPositionSelect } from '~/components/Lists/ListActions/MoveListPositionSelect';
import { useMoveListMutation } from '~/db/lists/lists.query';
import { useMoveListSelectOptions } from '~/utils/useMoveListSelectOptions';

type MoveListMenuProps = {
  id: string;
  onMoved: () => void;
};

export function MoveListMenu({ id, onMoved }: MoveListMenuProps) {
  const { mutate: moveList, isPending: isMovingList } = useMoveListMutation({
    onSuccess: onMoved,
  });
  const {
    isListsLoading,
    selectedBoardId,
    currentBoardId,
    currentPosition,
    isSameBoard,
    positions,
    selectedPosition,
    setSelectedBoardId,
    setSelectedPosition,
  } = useMoveListSelectOptions({ listId: id });

  const canMove = Boolean(currentBoardId && selectedPosition > 0);

  function handleMove() {
    if (!canMove) {
      return;
    }

    moveList({
      listId: id,
      targetBoardId: selectedBoardId,
      targetIndex: selectedPosition - 1,
    });
  }

  return (
    <MoveListFieldsContainer data-testid="MoveListFieldsContainer">
      <Suspense
        fallback={
          <ComboboxWrapper data-testid="ComboboxWrapper">
            <ComboboxLabel data-testid="ComboboxLabel">Board</ComboboxLabel>
            <SelectSkeleton style={{ minHeight: '44px' }} />
          </ComboboxWrapper>
        }
      >
        <MoveListBoardSelect
          selectedBoardId={selectedBoardId}
          currentBoardId={currentBoardId}
          setSelectedBoardId={setSelectedBoardId}
        />
      </Suspense>

      <MoveListPositionSelect
        isListsLoading={isListsLoading}
        positions={positions}
        isSameBoard={isSameBoard}
        currentPosition={currentPosition}
        selectedPosition={selectedPosition}
        setSelectedPosition={setSelectedPosition}
      />

      <MoveListButton
        data-testid="MoveListButton"
        onClick={handleMove}
        disabled={!canMove || isMovingList}
      >
        Move
      </MoveListButton>
    </MoveListFieldsContainer>
  );
}
