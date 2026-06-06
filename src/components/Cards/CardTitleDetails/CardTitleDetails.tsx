import { type MouseEvent, useRef, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { CardModalTrigger } from '~/components/Cards/Card.styled';
import { CardTitleChecklistDetails } from '~/components/Cards/CardTitleDetails/CardTitleChecklistsDetails';
import {
  CardTitleModalTriggerCircle,
  CardTitleModalTriggerText,
} from '~/components/Cards/CardTitleDetails/CardTitleDetails.styled';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { useCreateActivity } from '~/query/activity';
import { useGetCardById, useUpdateCard } from '~/query/cards';
import { useGetCardChecklistView } from '~/query/checklists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function CardTitleDetails({ id }: { id: string }) {
  const [isHovering, setHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pointerFocusedRef = useRef(false);
  const { data } = useGetCardById({ id });
  const { isSuccess, data: checklistViews } = useGetCardChecklistView({
    cardId: id,
  });
  const updateCard = useUpdateCard();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  const isCompleted = data?.isCompleted ?? false;

  function toggleCardCompletion(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!data) {
      return;
    }

    const contentNextState = isCompleted ? 'incomplete' : 'complete';

    updateCard({
      cardId: id,
      listId: data.listId,
      isCompleted: !isCompleted,
    });

    createActivity({
      cardId: id,
      listId: data.listId,
      boardId,
      type: 'feed',
      content: `marked this card ${contentNextState}`,
    });
  }

  function handleTriggerFocus() {
    setIsFocused(true);
  }

  function handleTriggerBlur() {
    setIsFocused(false);
    pointerFocusedRef.current = false;
  }

  function handleListCardMouseEnter() {
    setHovering(true);
    pointerFocusedRef.current = true;
    triggerRef.current?.focus({ preventScroll: true });
  }

  function handleListCardMouseLeave() {
    setHovering(false);

    if (
      pointerFocusedRef.current &&
      triggerRef.current === document.activeElement
    ) {
      triggerRef.current?.blur();
    }

    pointerFocusedRef.current = false;
  }

  return (
    <CardModalTrigger
      data-testid="CardModalTrigger"
      isHovered={isHovering || isFocused}
      onBlur={handleTriggerBlur}
      onFocus={handleTriggerFocus}
      ref={triggerRef}
    >
      <ListCardContainer
        data-testid="ListCardContainer"
        onMouseEnter={handleListCardMouseEnter}
        onMouseLeave={handleListCardMouseLeave}
      >
        <CardTitleModalTriggerText data-testid="CardTitleModalTriggerText">
          <CardTitleModalTriggerCircle
            aria-label="Mark card complete"
            data-testid="CardTitleModalTriggerCircle"
            isCompleted={isCompleted}
            isVisible={isFocused || isCompleted}
            onClick={toggleCardCompletion}
            type="button"
          >
            {isCompleted && <AiOutlineCheck size={10} />}
          </CardTitleModalTriggerCircle>

          {data?.cardTitle}
        </CardTitleModalTriggerText>

        {isSuccess && checklistViews.totalItemsForCard > 0 && (
          <CardTitleChecklistDetails checklistViews={checklistViews} />
        )}
      </ListCardContainer>
    </CardModalTrigger>
  );
}
