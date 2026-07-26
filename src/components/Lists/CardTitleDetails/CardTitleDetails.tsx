import { Suspense } from 'react';
import * as cardStyles from '~/components/Cards/Card.css';
import { CardCompletedIndicator } from '~/components/Cards/CardCompletedIndicator';
import * as cardTitleDetailsStyles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';
import { CardTitleDetailsContent } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContent';
import * as listStyles from '~/components/Lists/List.css';
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
    // biome-ignore lint/a11y/useFocusableInteractive: <handled elsewhere>
    // biome-ignore lint/a11y/useSemanticElements: <handled elsewhere>
    <div
      role="button"
      className={cardStyles.cardModalTrigger}
      data-testid="CardModalTrigger"
      onClick={open}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          open();
        }
      }}
    >
      {/* biome-ignore lint/a11y/useSemanticElements: <style conflict> */}
      <div
        className={listStyles.listCardContainer}
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
        <div
          className={cardTitleDetailsStyles.listCardTitleDetailsContainer({
            isCompleted,
          })}
          data-testid="ListCardTitleDetailsContainer"
        >
          <CardCompletedIndicator
            cardId={id}
            visible={isHovering || isFocused}
          />
          {title}
        </div>

        <Suspense
          fallback={
            <div
              className={cardTitleDetailsStyles.cardTitleDetailsContentSkeleton}
            />
          }
        >
          <CardTitleDetailsContent
            cardId={id}
            description={description}
            onShowMore={onShowMore}
          />
        </Suspense>

        {isLoading && (
          <div
            className={cardTitleDetailsStyles.cardTitleDetailsSpinnerContainer}
            data-testid="CardTitleDetailsSpinnerContainer"
          >
            <div
              className={cardTitleDetailsStyles.cardTitleDetailsSpinner}
              data-testid="CardTitleDetailsSpinner"
            />
          </div>
        )}
      </div>
    </div>
  );
}
