import { useEffect, useState } from 'react';
import { useGetCardById } from '~/db/cards/cards.query';
import {
  useGetListByCardId,
  useGetListsByBoardId,
} from '~/db/lists/lists.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function useMoveCardSelectOptions({ cardId }: { cardId: string }) {
  const { data: currentList } = useGetListByCardId({ id: cardId });
  const [selectedBoardId, setSelectedBoardId] = useState(useCurrentBoardId());
  const [selectedList, setSelectedList] = useState(currentList?.id ?? '');
  const [selectedPosition, setSelectedPosition] = useState(-1);
  const { data: lists, isLoading: isListsLoading } = useGetListsByBoardId({
    boardId: selectedBoardId,
  });
  const { data: currentCard } = useGetCardById({ id: cardId });
  const isSameList = currentCard?.listId === selectedList;

  const selectionIsValid = lists?.some((list) => list.id === selectedList);
  const defaultListId =
    // Fall back to the card's own list when it lives on this board, else the first.
    lists?.find((list) => list.id === currentList?.id)?.id ?? lists?.[0]?.id;
  const selectedListData = lists?.find((list) => list.id === selectedList);
  const listPositions = selectedListData?.cards?.length ?? 0;
  const positions =
    selectedListData?.id === currentList?.id
      ? listPositions
      : listPositions + 1;

  useEffect(() => {
    // Re-anchor the selection whenever switching boards leaves it pointing at a
    // list that no longer exists.
    if (defaultListId && !selectionIsValid) {
      setSelectedList(defaultListId);
    }
  }, [defaultListId, selectionIsValid]);

  useEffect(() => {
    if (selectedPosition === -1 && currentCard) {
      setSelectedPosition(isSameList ? currentCard.position + 1 : 1);
    }
  }, [isSameList, currentCard, selectedPosition]);

  return {
    isListsLoading,
    selectedBoardId,
    lists,
    currentListId: currentList?.id,
    selectedList,
    selectionIsValid,
    positions,
    selectedPosition,
    setSelectedList,
    setSelectedBoardId,
    setSelectedPosition,
  };
}
