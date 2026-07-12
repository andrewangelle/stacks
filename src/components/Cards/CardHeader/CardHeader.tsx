import { CardHeaderContainer } from '~/components/Cards/CardHeader/CardHeader.styled';
import { CloseCardButton } from '~/components/Cards/CardHeader/CloseCardButton';
import { MoveCardMenu } from './MoveCardMenu';

export type CardHeaderProps = {
  cardId: string;
  isNavigating: boolean;
};

export function CardHeader({ cardId, isNavigating }: CardHeaderProps) {
  return (
    <CardHeaderContainer data-testid="CardHeaderContainer">
      <MoveCardMenu id={cardId} />
      <CloseCardButton isNavigating={isNavigating} />
    </CardHeaderContainer>
  );
}
