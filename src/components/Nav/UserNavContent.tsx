import { Show, UserButton } from '@clerk/tanstack-react-start';
import { Logo } from '~/components/Nav/Logo';
import * as styles from '~/components/Nav/Nav.css';

export function UserNavContent() {
  return (
    <>
      <div className={styles.navColumn} data-testid="column-placeholder" />
      <Logo />

      <div className={styles.navColumn} data-testid="column-placeholder">
        <Show when="signed-in">
          <div style={{ padding: '5px 20px 0px 0px' }}>
            <UserButton />
          </div>
        </Show>
      </div>
    </>
  );
}
