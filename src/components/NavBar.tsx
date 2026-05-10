import { useLocation, useParams } from '@tanstack/react-router';
import * as Ri from 'react-icons/ri';
import { authClient } from '~/auth/client';
import { useGetBoardQuery } from '~/store/boardsApi';
import type { BoardBackground } from '~/styles/Boards';
import { LogOutText, NavBarContainer } from '~/styles/Page';

export function NavBar() {
  const location = useLocation();
  const params = useParams({ strict: false });
  const board = useGetBoardQuery(params.id);
  const session = authClient.useSession();

  const boardBackground = board.data?.boardColor ?? 'blue';
  const onAuthPath = location.pathname.startsWith('/auth');
  const background =
    location.pathname === '/boards' ||
    location.pathname === '/signin' ||
    onAuthPath
      ? 'blue'
      : boardBackground;

  const showLogout =
    !onAuthPath && location.pathname !== '/signin' && !!session.data?.user;

  return (
    <NavBarContainer background={background as BoardBackground}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <Ri.RiTrelloFill
          size={18}
          style={{ color: 'white', verticalAlign: '-webkit-baseline-middle' }}
        />
        <span style={{ verticalAlign: 'bottom' }}>stacks - a trello clone</span>
      </div>

      {showLogout && (
        <LogOutText
          onClick={() => {
            void authClient.signOut();
          }}
        >
          Log out
        </LogOutText>
      )}
    </NavBarContainer>
  );
}
