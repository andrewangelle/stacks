import { Show, UserButton } from '@clerk/tanstack-react-start';
import { useLocation } from '@tanstack/react-router';
import * as Ri from 'react-icons/ri';
import { BoardBar } from '~/components/Nav/BoardBar';
import { NavBarContainer, NavBarContent } from '~/components/Nav/Nav.styled';
import { LogoLink, Padding } from '~/styles/Page.styled';
import { useBoardBackgroundColor } from '~/utils/useBoardBackgroundColor';

export function NavBar() {
  const location = useLocation();
  const background = useBoardBackgroundColor();
  const isOnBoardPage = !(
    location.pathname === '/boards' ||
    location.pathname === '/signin' ||
    location.pathname.startsWith('/auth')
  );

  return (
    <NavBarContainer data-testid="NavBarContainer">
      <NavBarContent data-testid="NavBarContent" background={background}>
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
