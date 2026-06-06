import {
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  useRef,
  useState,
} from 'react';
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const pointerFocusedRef = useRef(false);
  const { data } = useGetCardById({ id });
  const { isSuccess, data: checklistViews } = useGetCardChecklistView({
    cardId: id,
  });
  const updateCard = useUpdateCard();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  const isCompleted = data?.isCompleted ?? false;
  const isCircleVisible = isHovering || isFocused;

  function toggleCardCompletion(event: MouseEvent<HTMLElement>) {
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
    pointerFocusedRef.current = true;
  }

  function handleTriggerBlur(event: FocusEvent<HTMLDivElement>) {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) {
      return;
    }

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

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  return (
    <CardModalTrigger asChild data-testid="CardModalTrigger">
      <ListCardContainer
        data-testid="ListCardContainer"
        onBlur={handleTriggerBlur}
        onFocus={handleTriggerFocus}
        onKeyDown={handleTriggerKeyDown}
        onMouseEnter={handleListCardMouseEnter}
        onMouseLeave={handleListCardMouseLeave}
        onPointerDown={handleTriggerFocus}
        ref={triggerRef}
        role="button"
        tabIndex={0}
      >
        <CardTitleModalTriggerText data-testid="CardTitleModalTriggerText">
          <CardTitleModalTriggerCircle
            aria-label="Mark card complete"
            data-completed={isCompleted ? '' : undefined}
            data-testid="CardTitleModalTriggerCircle"
            data-visible={isCircleVisible ? '' : undefined}
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
