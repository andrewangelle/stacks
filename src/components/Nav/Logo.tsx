import { useRouterState } from '@tanstack/react-router';
import { RiTrelloFill } from 'react-icons/ri';
import { CardTitleDetailsSpinner } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { LogoIconSlot, LogoLink } from '~/styles/Page.styled';

export function Logo() {
  const routerState = useRouterState();
  const showLoader =
    routerState.isLoading &&
    routerState.location.pathname !== routerState.resolvedLocation?.pathname &&
    !routerState.location.maskedLocation?.pathname.startsWith('/card/');
  return (
    <LogoLink to="/boards" data-testid="LogoLink">
      {showLoader && (
        <LogoIconSlot data-testid="LogoSpinner">
          <CardTitleDetailsSpinner />
        </LogoIconSlot>
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
    </LogoLink>
  );
}
