import { useLocation, useParams } from '@tanstack/react-router';
import { useAtom } from 'jotai';
import { RiTrelloFill } from 'react-icons/ri';
import { signedInState, tokenState } from '~/store/atoms';
import { useGetBoardQuery } from '~/store/boardsApi';
import type { BoardBackground } from '~/styles/Boards';
import { LogOutText, NavBarContainer } from '~/styles/Page';

export function NavBar() {
  const [, setSignedIn] = useAtom(signedInState);
  const [, setToken] = useAtom(tokenState);
  const location = useLocation();
  const params = useParams({ strict: false });
  const board = useGetBoardQuery(params.id);

  const boardBackground = board.data?.boardColor ?? 'blue';
  const background =
    location.pathname === '/boards' || location.pathname === '/signin'
      ? 'blue'
      : boardBackground;

  return (
    <NavBarContainer background={background as BoardBackground}>
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
