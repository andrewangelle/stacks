import { Popover } from 'radix-ui';
import * as boardsStyles from '~/components/Boards/Boards.css';
import * as moveCardMenuStyles from '~/components/Cards/MoveCardMenu/MoveCardMenu.css';

export function MoveCardMenuFallback() {
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

      <div>
        <div
          className={moveCardMenuStyles.dropdownLabel}
          data-testid="BoardSelectTitle"
        >
          Board
        </div>

        <div className={moveCardMenuStyles.selectSkeleton} />

        <div className={moveCardMenuStyles.moveCardSelectRow}>
          <div className={moveCardMenuStyles.moveCardListColumn}>
            <div
              className={moveCardMenuStyles.dropdownLabel}
              data-testid="ListSelectTitle"
            >
              List
            </div>
            <div className={moveCardMenuStyles.selectSkeleton} />
          </div>

          <div className={moveCardMenuStyles.moveCardPositionColumn}>
            <div
              className={moveCardMenuStyles.dropdownLabel}
              data-testid="PositionSelectTitle"
            >
              Position
            </div>

            <div className={moveCardMenuStyles.selectSkeleton} />
          </div>
        </div>
      </div>

      <button
        type="button"
        className={moveCardMenuStyles.moveCardButton}
        data-testid="MoveCardButton"
        onClick={() => null}
        disabled={true}
      >
        Move
      </button>
    </Popover.Content>
  );
}
