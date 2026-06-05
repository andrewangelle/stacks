import { Show, UserButton } from '@clerk/tanstack-react-start';
import { useLocation } from '@tanstack/react-router';
import { BoardBar } from '~/components/Nav/BoardBar';
import { Logo } from '~/components/Nav/Logo';
import { NavBarContainer, NavBarContent } from '~/components/Nav/Nav.styled';
import { Padding } from '~/styles/Page.styled';
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
