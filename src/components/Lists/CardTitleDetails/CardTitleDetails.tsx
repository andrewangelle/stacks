import { useSearch } from '@tanstack/react-router';
import { Suspense, useEffect } from 'react';
import { CardModalTrigger } from '~/components/Cards/Card.styled';
import { CardCompletedIndicator } from '~/components/Cards/CardCompletedIndicator';
import {
  CardTitleDetailsContentSkeleton,
  CardTitleDetailsSpinner,
  CardTitleDetailsSpinnerContainer,
  ListCardTitleDetailsContainer,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsContent } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContent';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { useCardModalTrigger } from '~/utils/useCardModalTrigger';

type CardTitleDetailsProps = {
  id: string;
  description: string;
  isCompleted: boolean;
  title: string;
};

export function CardTitleDetails({
  id,
  title,
  description,
  isCompleted,
}: CardTitleDetailsProps) {
  const search = useSearch({ strict: false }) as { from?: string };
  const prevCardId = search?.from?.split('card-')[1];

  const {
    ref,
    isHovering,
    isFocused,
    isLoading,
    onBlur,
    onFocus,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onPointerDown,
    onShowMore,
    open,
  } = useCardModalTrigger(id);

  useEffect(() => {
    if (prevCardId && id === prevCardId) {
      ref.current?.focus();
    }
  }, [prevCardId, ref.current, id]);

  return (
    <CardModalTrigger data-testid="CardModalTrigger" onClick={open}>
      <ListCardContainer
        ref={ref}
        role="button"
        tabIndex={0}
        data-testid="ListCardContainer"
        data-card-id={id}
        onBlur={onBlur}
        onFocus={onFocus}
        onKeyDown={onKeyDown}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onPointerDown={onPointerDown}
      >
        <ListCardTitleDetailsContainer
          data-testid="ListCardTitleDetailsContainer"
          isCompleted={isCompleted}
        >
          <CardCompletedIndicator
            cardId={id}
            visible={isHovering || isFocused}
          />
          {title}
        </ListCardTitleDetailsContainer>

        <Suspense fallback={<CardTitleDetailsContentSkeleton />}>
          <CardTitleDetailsContent
            cardId={id}
            description={description}
            onShowMore={onShowMore}
          />
        </Suspense>

        {isLoading && (
          <CardTitleDetailsSpinnerContainer data-testid="CardTitleDetailsSpinnerContainer">
            <CardTitleDetailsSpinner data-testid="CardTitleDetailsSpinner" />
          </CardTitleDetailsSpinnerContainer>
        )}
      </ListCardContainer>
    </CardModalTrigger>
  );
}
