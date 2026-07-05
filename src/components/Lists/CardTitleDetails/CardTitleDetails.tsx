import { useNavigate, useRouterState } from '@tanstack/react-router';
import {
  type FocusEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { CardModalTrigger } from '~/components/Cards/Card.styled';
import { CardCompletedIndicator } from '~/components/Cards/CardCompletedIndicator';
import {
  CardTitleDetailsSpinner,
  CardTitleDetailsSpinnerContainer,
  ListCardTitleDetailsContainer,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsContent } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContent';
import { useCardTitleDetailsVisibility } from '~/components/Lists/CardTitleDetails/useCardTitleDetailsVisibility';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { useGetCardById } from '~/db/cards/cards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

export function CardTitleDetails({ id }: { id: string }) {
  const boardId = useCurrentBoardId();
  const navigate = useNavigate();
  const { isLoading } = useRouterState();
  const [isHovering, setHovering] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpeningCard, setIsOpeningCard] = useState(false);
  const triggerRef = useRef<HTMLDivElement>(null);
  const pointerFocusedRef = useRef(false);
  const { data } = useGetCardById({ id });
  const { hasDetailInfo } = useCardTitleDetailsVisibility(id);

  const isCircleVisible = isHovering || isFocused;

  useEffect(() => {
    if (!isLoading) {
      setIsOpeningCard(false);
    }
  }, [isLoading]);

  function openCardModal() {
    setIsOpeningCard(true);
    navigate({
      to: '/board/$id/card/$cardId',
      params: { id: boardId, cardId: id },
    });
  }

  function openCardModalToChecklist(checklistId: string) {
    navigate({
      href: `/card/${id.slice(0, 8)}#checklist-${checklistId}`,
      resetScroll: false,
      hashScrollIntoView: false,
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
      openCardModal();
    }
  }

  return (
    <CardModalTrigger data-testid="CardModalTrigger" onClick={openCardModal}>
      <ListCardContainer
        ref={triggerRef}
        role="button"
        tabIndex={0}
        data-testid="ListCardContainer"
        data-card-id={id}
        onBlur={handleTriggerBlur}
        onFocus={handleTriggerFocus}
        onKeyDown={handleTriggerKeyDown}
        onMouseEnter={handleListCardMouseEnter}
        onMouseLeave={handleListCardMouseLeave}
        onPointerDown={handleTriggerFocus}
      >
        <ListCardTitleDetailsContainer data-testid="ListCardTitleDetailsContainer">
          <CardCompletedIndicator cardId={id} visible={isCircleVisible} />
          {data?.cardTitle}
        </ListCardTitleDetailsContainer>

        {hasDetailInfo && (
          <CardTitleDetailsContent
            cardId={id}
            onShowMore={openCardModalToChecklist}
          />
        )}

        {isLoading && isOpeningCard && (
          <CardTitleDetailsSpinnerContainer data-testid="CardTitleDetailsSpinnerContainer">
            <CardTitleDetailsSpinner data-testid="CardTitleDetailsSpinner" />
          </CardTitleDetailsSpinnerContainer>
        )}
      </ListCardContainer>
    </CardModalTrigger>
  );
}
