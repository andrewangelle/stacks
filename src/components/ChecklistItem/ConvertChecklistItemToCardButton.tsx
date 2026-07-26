import { useEffect } from 'react';
import * as styles from '~/components/ChecklistItem/ChecklistItem.css';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useCreateCard } from '~/db/cards/cards.query';
import {
  useDeleteChecklistItem,
  useGetChecklistItem,
} from '~/db/checklistItems/checklistItems.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type ConvertChecklistItemToCardButtonProps = {
  id: string;
  checklistId: string;
};

export function ConvertChecklistItemToCardButton({
  id,
  checklistId,
}: ConvertChecklistItemToCardButtonProps) {
  const { data: checklistItem } = useGetChecklistItem({
    itemId: id,
    checklistId,
  });
  const boardId = useCurrentBoardId();
  const createActivity = useCreateActivity();
  const deleteChecklistItem = useDeleteChecklistItem({ checklistId });
  const {
    mutate: createCard,
    isSuccess: isCardCreated,
    data: response,
  } = useCreateCard();

  function convertToCard() {
    if (checklistItem) {
      createCard({
        listId: checklistItem.listId,
        cardTitle: checklistItem.label,
      });
    }
  }

  useEffect(() => {
    if (isCardCreated && response.data[0].id && checklistItem) {
      createActivity({
        cardId: response.data[0].id,
        listId: checklistItem.listId,
        boardId,
        type: 'feed',
        content: `converted this card from a checklist item on {{ linkTo:${checklistItem.cardId} }}`,
      });

      deleteChecklistItem({
        itemId: id,
      });
    }
  }, [
    isCardCreated,
    response,
    checklistItem,
    boardId,
    createActivity,
    deleteChecklistItem,
    id,
  ]);

  return (
    <button
      type="button"
      className={styles.checklistItemOptionsListItem}
      data-testid="ConvertChecklistItemToCardButton"
      onClick={convertToCard}
    >
      Convert to card
    </button>
  );
}
