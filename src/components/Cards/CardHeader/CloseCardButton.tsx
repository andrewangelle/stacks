import type { CardHeaderProps } from '~/components/Cards/CardHeader/CardHeader';
import {
  CardModalClose,
  CardModalCloseSpinnerSlot,
} from '~/components/Cards/CardHeader/CardHeader.styled';
import { CardTitleDetailsSpinner } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';

export function CloseCardButton({
  isNavigating,
}: Pick<CardHeaderProps, 'isNavigating'>) {
  return (
    <>
      {isNavigating && (
        <CardModalCloseSpinnerSlot data-testid="CardModalCloseSpinner">
          <CardTitleDetailsSpinner />
        </CardModalCloseSpinnerSlot>
      )}

      {!isNavigating && (
        <CardModalClose data-testid="CardModalClose">X</CardModalClose>
      )}
    </>
  );
}
