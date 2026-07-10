import { Suspense } from 'react';
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
  isCompleted: boolean;
  title: string;
};

export function CardTitleDetails({
  id,
  title,
  isCompleted,
}: CardTitleDetailsProps) {
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
          <CardTitleDetailsContent cardId={id} onShowMore={onShowMore} />
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
