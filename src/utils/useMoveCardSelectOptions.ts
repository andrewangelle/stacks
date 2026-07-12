import { useEffect, useState } from 'react';
import {
  useGetListByCardId,
  useGetListsByBoardId,
} from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function useMoveCardSelectOptions({ cardId }: { cardId: string }) {
  const { data: currentList } = useGetListByCardId({ id: cardId });
  const [selectedBoardId, setSelectedBoardId] = useState(useCurrentBoardId());
  const [selectedList, setSelectedList] = useState(currentList?.id ?? '');
  const [selectedPosition, setSelectedPosition] = useState(1);
  const { data: lists, isLoading: isListsLoading } = useGetListsByBoardId({
    boardId: selectedBoardId,
  });

  const selectionIsValid = lists?.some((list) => list.id === selectedList);
  const defaultListId =
    // Fall back to the card's own list when it lives on this board, else the first.
    lists?.find((list) => list.id === currentList?.id)?.id ?? lists?.[0]?.id;

  useEffect(() => {
    // Re-anchor the selection whenever switching boards leaves it pointing at a
    // list that no longer exists.
    if (defaultListId && !selectionIsValid) {
      setSelectedList(defaultListId);
    }
  }, [defaultListId, selectionIsValid]);

  const positions =
    (lists?.find((list) => list.id === selectedList)?.cards?.length ?? 0) + 1;

  return {
    isListsLoading,
    selectedBoardId,
    lists,
    currentListId: currentList?.id,
    selectedList,
    positions,
    selectedPosition,
    setSelectedList,
    setSelectedBoardId,
    setSelectedPosition,
  };
}
