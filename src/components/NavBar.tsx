import { Show, UserButton } from '@clerk/tanstack-react-start';
import { useLocation, useParams } from '@tanstack/react-router';
import * as Ri from 'react-icons/ri';
import { useGetBoardQuery } from '~/store/boardsApi';
import type { BoardBackground } from '~/styles/Boards';
import { NavBarContainer } from '~/styles/Page';

export function NavBar() {
  const location = useLocation();
  const params = useParams({ strict: false });
  const board = useGetBoardQuery(params.id);

  const boardBackground = board.data?.boardColor ?? 'blue';
  const onAuthPath = location.pathname.startsWith('/auth');
  const background =
    location.pathname === '/boards' ||
    location.pathname === '/signin' ||
    onAuthPath
      ? 'blue'
      : boardBackground;

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

      <Show when="signed-in">
        <UserButton />
      </Show>
    </NavBarContainer>
  );
}
