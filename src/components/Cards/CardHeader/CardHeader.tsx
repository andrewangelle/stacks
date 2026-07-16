import { CardHeaderContainer } from '~/components/Cards/CardHeader/CardHeader.styled';
import { CloseCardButton } from '~/components/Cards/CardHeader/CloseCardButton';
import { MoveCardMenu } from '~/components/Cards/MoveCardMenu/MoveCardMenu';

export type CardHeaderProps = {
  cardId: string;
  isNavigating: boolean;
  asPage?: boolean;
};

export function CardHeader({ cardId, isNavigating, asPage }: CardHeaderProps) {
  return (
    <CardHeaderContainer data-testid="CardHeaderContainer">
      <MoveCardMenu id={cardId} />
      <CloseCardButton isNavigating={isNavigating} asPage={asPage} />
    </CardHeaderContainer>
  );
}
