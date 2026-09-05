import {
  Combobox,
  type ComboboxItemType,
} from '~/components/shared/Combobox/Combobox';
import { useGetBoards } from '~/db/boards/boards.query';

type MoveListBoardSelectProps = {
  selectedBoardId: string;
  currentBoardId?: string;
  setSelectedBoardId: (boardId: string) => void;
};

export function MoveListBoardSelect({
  selectedBoardId,
  currentBoardId,
  setSelectedBoardId,
}: MoveListBoardSelectProps) {
  const { data: boards } = useGetBoards();

  const items =
    boards?.map((board) => ({
      id: board.id,
      label: board.boardTitle,
      current: board.id === currentBoardId,
    })) ?? [];

  const selectedItem =
    items.find((item) => item.id === selectedBoardId) ??
    // The board url masks the id to 8 chars, so match on the prefix too.
    items.find((item) => item.id.startsWith(selectedBoardId)) ??
    null;

  function onSelectedItemChange(item: ComboboxItemType | null) {
    if (item) {
      setSelectedBoardId(item.id);
    }
  }

  return (
    <Combobox
      testId="Board"
      label="Board"
      items={items}
      selectedItem={selectedItem}
      onSelectedItemChange={onSelectedItemChange}
    />
  );
}
