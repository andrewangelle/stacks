import { Suspense } from 'react';
import * as moveCardMenuStyles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';
import * as listActionsStyles from '~/components/Lists/ListActions/ListActions.css';
import { MoveListBoardSelect } from '~/components/Lists/ListActions/MoveListBoardSelect';
import { MoveListPositionSelect } from '~/components/Lists/ListActions/MoveListPositionSelect';
import * as comboboxStyles from '~/components/shared/Combobox/Combobox.css';
import { useMoveListMutation } from '~/db/lists/lists.query';
import { useMoveListSelectOptions } from '~/utils/useMoveListSelectOptions';

type MoveListMenuProps = {
  id: string;
  closeMenu: () => void;
};

export function MoveListMenu({ id, closeMenu }: MoveListMenuProps) {
  const { mutate: moveList, isPending: isMovingList } = useMoveListMutation();
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

    closeMenu();

    moveList({
      listId: id,
      targetBoardId: selectedBoardId,
      targetIndex: selectedPosition - 1,
    });
  }

  return (
    <div
      className={listActionsStyles.moveListFieldsContainer}
      data-testid="MoveListFieldsContainer"
    >
      <Suspense
        fallback={
          <div
            className={comboboxStyles.comboboxWrapper}
            data-testid="ComboboxWrapper"
          >
            <span
              className={comboboxStyles.comboboxLabel}
              data-testid="ComboboxLabel"
            >
              Board
            </span>
            <div
              className={moveCardMenuStyles.selectSkeleton}
              style={{ minHeight: '44px' }}
            />
          </div>
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

      <button
        type="button"
        className={listActionsStyles.moveListButton}
        data-testid="MoveListButton"
        onClick={handleMove}
        disabled={!canMove || isMovingList}
      >
        Move
      </button>
    </div>
  );
}
