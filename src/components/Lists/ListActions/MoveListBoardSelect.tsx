import { useCallback, useMemo } from 'react';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/Combobox/Combobox';
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

  const items = useMemo(
    () =>
      boards?.map((board) => ({
        id: board.id,
        label: board.boardTitle,
        current: board.id === currentBoardId,
      })) ?? [],
    [boards, currentBoardId],
  );

  const selectedItem = useMemo(
    () =>
      items.find((item) => item.id === selectedBoardId) ??
      // The board url masks the id to 8 chars, so match on the prefix too.
      items.find((item) => item.id.startsWith(selectedBoardId)) ??
      null,
    [items, selectedBoardId],
  );

  const onSelectedItemChange = useCallback(
    (item: ComboboxItemType | null) => {
      if (item) {
        setSelectedBoardId(item.id);
      }
    },
    [setSelectedBoardId],
  );

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
