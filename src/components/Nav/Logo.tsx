import { Link, useRouterState } from '@tanstack/react-router';
import { RiTrelloFill } from 'react-icons/ri';
import * as cardTitleDetailsStyles from '~/components/Lists/CardTitleDetails/CardTitleDetails.css';
import * as pageStyles from '~/styles/Page.css';

export function Logo() {
  const routerState = useRouterState();
  const showLoader =
    routerState.isLoading &&
    routerState.location.pathname !== routerState.resolvedLocation?.pathname &&
    !routerState.location.maskedLocation?.pathname.startsWith('/card/');
  return (
    <Link className={pageStyles.logoLink} to="/boards" data-testid="LogoLink">
      {showLoader && (
        <span className={pageStyles.logoIconSlot} data-testid="LogoSpinner">
          <div className={cardTitleDetailsStyles.cardTitleDetailsSpinner} />
        </span>
      )}
      {!showLoader && (
        <RiTrelloFill
          size={18}
          style={{
            color: 'white',
            verticalAlign: '-webkit-baseline-middle',
            transform: 'scale(-1, -1)',
          }}
        />
      )}
      <span style={{ verticalAlign: 'bottom' }}>stacks - a trello clone</span>
    </Link>
  );
}
