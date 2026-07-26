import { Logo } from '~/components/Nav/Logo';
import * as styles from '~/components/Nav/Nav.css';
import { UserNavContent } from '~/components/Nav/UserNavContent';

export function NavBarClient() {
  return (
    <div className={styles.navBarContainer} data-testid="NavBarContainer">
      <div
        className={styles.navBarContent({ background: 'blue' })}
        key={'blue'}
        data-testid="NavBarContent"
      >
        <UserNavContent />
      </div>
    </div>
  );
}

export function NavBarFallback() {
  return (
    <div className={styles.navBarContainer} data-testid="NavBarContainer">
      <div
        className={styles.navBarContent({ background: 'blue' })}
        key={'blue'}
        data-testid="NavBarContent"
      >
        <div className={styles.navColumn} data-testid="column-placeholder" />
        <Logo />
        <div className={styles.navColumn} data-testid="column-placeholder" />
      </div>
    </div>
  );
}
