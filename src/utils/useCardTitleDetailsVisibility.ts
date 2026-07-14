import { useGetCard } from '~/db/cards/cards.query';
import { useGetCardTitleDetailsChecklists } from '~/db/checklists/checklists.query';

export function useCardTitleDetailsVisibility(cardId: string) {
  const { isSuccess, data: checklistViews } = useGetCardTitleDetailsChecklists({
    cardId,
  });
  const { data: card } = useGetCard({ id: cardId });

  const commentsCount = card?.commentsCount ?? 0;

  const hasChecklistDetails =
    isSuccess && checklistViews?.totalItemsForCard > 0;

  const hasDetailInfo = hasChecklistDetails || commentsCount > 0;

  return {
    commentsCount,
    isSuccess,
    checklistViews,
    hasDetailInfo,
    hasChecklistDetails,
  };
}
