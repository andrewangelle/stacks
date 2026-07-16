import type { CardHeaderProps } from '~/components/Cards/CardHeader/CardHeader';
import {
  CardModalClose,
  CardModalCloseSpinnerSlot,
  CardPageClose,
} from '~/components/Cards/CardHeader/CardHeader.styled';
import { CardTitleDetailsSpinner } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';

export function CloseCardButton({
  isNavigating,
  asPage,
}: Pick<CardHeaderProps, 'isNavigating' | 'asPage'>) {
  const CloseButton = asPage ? CardPageClose : CardModalClose;

  return (
    <>
      {isNavigating && (
        <CardModalCloseSpinnerSlot data-testid="CardModalCloseSpinner">
          <CardTitleDetailsSpinner />
        </CardModalCloseSpinnerSlot>
      )}

      {!isNavigating && (
        <CloseButton data-testid="CardModalClose">X</CloseButton>
      )}
    </>
  );
}
