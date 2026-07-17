import { type RefObject, useCallback, useMemo } from 'react';
import {
  Combobox,
  type ComboboxItemType,
} from '~/components/Combobox/Combobox';
import { useGetBoards } from '~/db/boards/boards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type BoardSelectProps = {
  cardId: string;
  selectedBoardId?: string;
  setSelectedBoardId: (boardId: string) => void;
  ref: RefObject<HTMLDivElement | null>;
};

export function BoardSelect({
  selectedBoardId,
  setSelectedBoardId,
}: BoardSelectProps) {
  const boardId = useCurrentBoardId();
  const { data: boards } = useGetBoards();

  const selectedBoard = selectedBoardId
    ? boards?.find((board) => board.id.startsWith(selectedBoardId))
    : undefined;

  const items = useMemo(
    () =>
      boards?.map((board) => ({
        id: board.id,
        label: board.boardTitle,
        current: board.id.startsWith(boardId),
      })) ?? [],
    [boards, boardId],
  );

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedBoard?.id) ?? null,
    [items, selectedBoard],
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
