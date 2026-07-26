import { Dialog } from 'radix-ui';
import * as styles from '~/components/Cards/Card.css';

export function CardFallback() {
  return (
    <Dialog.Root data-testid="CardModalRoot" open>
      <Dialog.Portal data-testid="CardModalPortal">
        <Dialog.Overlay
          className={styles.cardModalOverlay}
          data-testid="CardModalOverlay"
        >
          <Dialog.Content
            className={styles.cardModalContent}
            data-testid="CardModalContent"
            aria-describedby={undefined}
          >
            <Dialog.Title className={styles.cardModalHiddenTitle}>
              Loading card
            </Dialog.Title>
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
