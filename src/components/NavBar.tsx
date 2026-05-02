import { useLocation } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { RiTrelloFill } from 'react-icons/ri';
import { signedInState, tokenState } from '~/store/atoms';
import { LogOutText, NavBarContainer } from '~/styles/Page';

export function NavBar() {
  const [, setSignedIn] = useAtom(signedInState);
  const [, setToken] = useAtom(tokenState);
  const location = useLocation();

  // Not sure why this was here
  // const background =
  //   location.pathname === '/boards' || location.pathname === '/signin'
  //     ? 'blue'
  //     : 'default';

  return (
    <NavBarContainer background={'blue'}>
      <div>
        <RiTrelloFill
          size={18}
          style={{ color: 'white', verticalAlign: '-webkit-baseline-middle' }}
        />
        <span style={{ verticalAlign: 'bottom' }}>stacks - a trello clone</span>
      </div>

      {location.pathname !== '/signin' && (
        <LogOutText
          onClick={() => {
            setSignedIn(false);
            setToken(null);
          }}
        >
          Log out
        </LogOutText>
      )}
    </NavBarContainer>
  );
}
