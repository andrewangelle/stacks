import { Show, UserButton } from '@clerk/tanstack-react-start';
import { useLocation, useParams } from '@tanstack/react-router';
import * as Ri from 'react-icons/ri';
import { useGetBoardQuery } from '~/query/boards';
import type { BoardBackground } from '~/styles/Boards';
import { LogoLink, NavBarContainer, Padding } from '~/styles/Page';

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
    <NavBarContainer
      data-testid="NavBarContainer"
      background={background as BoardBackground}
    >
      <div data-testid="column-placeholder" />
      <Logo />

      <Show when="signed-in">
        <Padding padding="5px 20px 0px 0px">
          <UserButton />
        </Padding>
      </Show>

      <Show when="signed-out">
        <div data-testid="column-placeholder" />
      </Show>
    </NavBarContainer>
  );
}

function Logo() {
  return (
    <LogoLink to="/boards" data-testid="LogoLink">
      <Ri.RiTrelloFill
        size={18}
        style={{ color: 'white', verticalAlign: '-webkit-baseline-middle' }}
      />
      <span style={{ verticalAlign: 'bottom' }}>stacks - a trello clone</span>
    </LogoLink>
  );
}
