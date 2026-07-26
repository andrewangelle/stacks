import { Dialog } from 'radix-ui';
import type { CardHeaderProps } from '~/components/Cards/CardHeader/CardHeader';
import * as cardHeaderStyles from '~/components/Cards/CardHeader/CardHeader.css';
import * as cardTitleDetailsStyles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';

export function CloseCardButton({
  isNavigating,
  asPage,
}: Pick<CardHeaderProps, 'isNavigating' | 'asPage'>) {
  const closeClassName = asPage
    ? cardHeaderStyles.cardPageClose
    : cardHeaderStyles.cardModalClose;

  return (
    <>
      {isNavigating && (
        <div
          className={cardHeaderStyles.cardModalCloseSpinnerSlot}
          data-testid="CardModalCloseSpinner"
        >
          <div className={cardTitleDetailsStyles.cardTitleDetailsSpinner} />
        </div>
      )}

      {!isNavigating && (
        <Dialog.Close className={closeClassName} data-testid="CardModalClose">
          X
        </Dialog.Close>
      )}
    </>
  );
}
