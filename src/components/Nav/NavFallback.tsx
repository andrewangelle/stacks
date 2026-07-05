import { Logo } from '~/components/Nav/Logo';
import { NavBarContainer, NavBarContent } from '~/components/Nav/Nav.styled';

export function NavFallback() {
  return (
    <NavBarContainer data-testid="NavBarContainer">
      <NavBarContent
        key={'blue'}
        data-testid="NavBarContent"
        background={'blue'}
      >
        <div data-testid="column-placeholder" />
        <Logo />
        <div data-testid="column-placeholder" />
      </NavBarContent>
    </NavBarContainer>
  );
}
