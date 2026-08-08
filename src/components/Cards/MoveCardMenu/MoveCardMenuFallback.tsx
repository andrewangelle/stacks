import {
  CreateBoardCloseBorder,
  PopoverClose,
} from '~/components/Boards/Boards.styled';
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

export function MoveCardMenuFallback() {
  return (
    <MoveCardMenuContent
      side="bottom"
      align="start"
      sideOffset={8}
      alignOffset={4}
    >
      <MoveCardMenuHeader>
        Move card
        <PopoverClose>X</PopoverClose>
      </MoveCardMenuHeader>

      <CreateBoardCloseBorder />

      <div>
        <DropdownLabel data-testid="BoardSelectTitle">Board</DropdownLabel>

        <SelectSkeleton />

        <MoveCardSelectRow>
          <MoveCardListColumn>
            <DropdownLabel data-testid="ListSelectTitle">List</DropdownLabel>
            <SelectSkeleton />
          </MoveCardListColumn>

          <MoveCardPositionColumn>
            <DropdownLabel data-testid="PositionSelectTitle">
              Position
            </DropdownLabel>

            <SelectSkeleton />
          </MoveCardPositionColumn>
        </MoveCardSelectRow>
      </div>

      <MoveCardButton onClick={() => null} disabled={true}>
        Move
      </MoveCardButton>
    </MoveCardMenuContent>
  );
}
