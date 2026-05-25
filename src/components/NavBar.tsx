import { Show, UserButton } from '@clerk/tanstack-react-start';
import { useLocation } from '@tanstack/react-router';
import * as Ri from 'react-icons/ri';
import { BoardBar } from '~/components/BoardBar';
import type { BoardBackground } from '~/components/Boards/Boards.styled';
import { useGetBoardQuery } from '~/query/boards';
import {
  LogoLink,
  NavBarContainer,
  NavBarContent,
  Padding,
} from '~/styles/Page.styled';

export function NavBar() {
  const location = useLocation();
  const board = useGetBoardQuery();

  const boardBackground = board.data?.boardColor ?? 'blue';
  const onAuthPath = location.pathname.startsWith('/auth');
  const isOnBoardPage = !(
    location.pathname === '/boards' ||
    location.pathname === '/signin' ||
    onAuthPath
  );
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
      <NavBarContent data-testid="NavBarContent">
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
      </NavBarContent>

      {isOnBoardPage && <BoardBar />}
    </NavBarContainer>
  );
}

function Logo() {
  return (
    <LogoLink to="/boards" data-testid="LogoLink">
      <Ri.RiTrelloFill
        size={18}
        style={{
          color: 'white',
          verticalAlign: '-webkit-baseline-middle',
          transform: 'scale(-1, -1)',
        }}
      />
      <span style={{ verticalAlign: 'bottom' }}>stacks - a trello clone</span>
    </LogoLink>
  );
}
