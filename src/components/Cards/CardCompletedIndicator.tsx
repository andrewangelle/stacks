import type { MouseEvent } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { CardCompletedIndicatorCircle } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useGetCardById, useUpdateCard } from '~/db/cards/cards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type CardCompletedIndicatorProps = {
  cardId: string;
  visible?: boolean;
  circleSize?: string;
};

export function CardCompletedIndicator({
  cardId,
  visible = true,
  circleSize,
}: CardCompletedIndicatorProps) {
  const { data } = useGetCardById({ id: cardId });
  const isCompleted = data?.isCompleted ?? false;
  const updateCard = useUpdateCard();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  function toggleCardCompletion(event: MouseEvent<HTMLElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!data) {
      return;
    }

    const contentNextState = isCompleted ? 'incomplete' : 'complete';

    updateCard({
      cardId,
      listId: data.listId,
      isCompleted: !isCompleted,
    });

    createActivity({
      cardId,
      listId: data.listId,
      boardId,
      type: 'feed',
      content: `marked this card ${contentNextState}`,
    });
  }

  return (
    <CardCompletedIndicatorCircle
      circleSize={circleSize}
      aria-label="Mark card complete"
      data-completed={isCompleted ? '' : undefined}
      data-testid="CardTitleModalTriggerCircle"
      data-visible={visible ? '' : undefined}
      onClick={toggleCardCompletion}
      type="button"
    >
      {isCompleted && (
        <AiOutlineCheck
          size={10}
          data-testid="CardCompletedIndicatorCheckmark"
        />
      )}
    </CardCompletedIndicatorCircle>
  );
}
