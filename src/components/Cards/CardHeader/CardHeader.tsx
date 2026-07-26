import * as styles from '~/components/Cards/CardHeader/CardHeader.css';
import { CloseCardButton } from '~/components/Cards/CardHeader/CloseCardButton';
import { MoveCardMenu } from '~/components/Cards/MoveCardMenu/MoveCardMenu';

export type CardHeaderProps = {
  cardId: string;
  isNavigating: boolean;
  asPage?: boolean;
};

export function CardHeader({ cardId, isNavigating, asPage }: CardHeaderProps) {
  return (
    <div
      className={styles.cardHeaderContainer}
      data-testid="CardHeaderContainer"
    >
      <MoveCardMenu id={cardId} />
      <CloseCardButton isNavigating={isNavigating} asPage={asPage} />
    </div>
  );
}
