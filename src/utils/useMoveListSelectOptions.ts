import { useEffect, useState } from 'react';
import { useGetListById, useGetListsByBoardId } from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function useMoveListSelectOptions({ listId }: { listId: string }) {
  const sourceBoardId = useCurrentBoardId();
  const { data: currentList } = useGetListById({ id: listId });
  // Default to the list's full board id (the url-masked current id can't be sent
  // to the server as a target, which matches board ids exactly).
  const [selectedBoardId, setSelectedBoardId] = useState(
    currentList?.boardId ?? sourceBoardId,
  );
  const [selectedPosition, setSelectedPosition] = useState(-1);
  const { data: lists, isLoading: isListsLoading } = useGetListsByBoardId({
    boardId: selectedBoardId,
  });

  // The board url is masked to the first 8 chars, so the current board id can be
  // a prefix of the list's full board id; the combobox hands back full ids.
  const isSameBoard = currentList
    ? currentList.boardId.startsWith(selectedBoardId)
    : true;
  const listCount = lists?.length ?? 0;
  // A same-board move keeps the list among the existing slots; moving to another
  // board adds one slot for the incoming list.
  const positions = isSameBoard ? listCount : listCount + 1;

  useEffect(() => {
    if (selectedPosition === -1 && currentList) {
      setSelectedPosition(isSameBoard ? currentList.position + 1 : 1);
    }
  }, [isSameBoard, currentList, selectedPosition]);

  return {
    isListsLoading,
    sourceBoardId,
    selectedBoardId,
    currentBoardId: currentList?.boardId,
    currentPosition: currentList?.position,
    isSameBoard,
    positions,
    selectedPosition,
    setSelectedBoardId,
    setSelectedPosition,
  };
}
