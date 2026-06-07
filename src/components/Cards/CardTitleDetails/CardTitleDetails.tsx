import { type FocusEvent, type KeyboardEvent, useRef, useState } from 'react';
import { CardModalTrigger } from '~/components/Cards/Card.styled';
import { CardCompletedIndicator } from '~/components/Cards/CardCompletedIndicator';
import { CardTitleChecklistDetails } from '~/components/Cards/CardTitleDetails/CardTitleChecklistsDetails';
import { CardTitleModalTriggerText } from '~/components/Cards/CardTitleDetails/CardTitleDetails.styled';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { useGetCardById } from '~/query/cards';
import { useGetCardChecklistView } from '~/query/checklists';

export function CardTitleDetails({ id }: { id: string }) {
  const [isHovering, setHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pointerFocusedRef = useRef(false);
  const { data } = useGetCardById({ id });
  const { isSuccess, data: checklistViews } = useGetCardChecklistView({
    cardId: id,
  });

  const isCircleVisible = isHovering || isFocused;

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
        ref={triggerRef}
        role="button"
        tabIndex={0}
        data-testid="ListCardContainer"
        onBlur={handleTriggerBlur}
        onFocus={handleTriggerFocus}
        onKeyDown={handleTriggerKeyDown}
        onMouseEnter={handleListCardMouseEnter}
        onMouseLeave={handleListCardMouseLeave}
        onPointerDown={handleTriggerFocus}
      >
        <CardTitleModalTriggerText data-testid="CardTitleModalTriggerText">
          <CardCompletedIndicator cardId={id} visible={isCircleVisible} />

          {data?.cardTitle}
        </CardTitleModalTriggerText>

        {isSuccess && checklistViews.totalItemsForCard > 0 && (
          <CardTitleChecklistDetails checklistViews={checklistViews} />
        )}
      </ListCardContainer>
    </CardModalTrigger>
  );
}
