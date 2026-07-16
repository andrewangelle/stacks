import { Logo } from '~/components/Nav/Logo';
import {
  NavBarContainer,
  NavBarContent,
  NavColumn,
} from '~/components/Nav/Nav.styled';
import { UserNavContent } from '~/components/Nav/UserNavContent';

export function NavBarClient() {
  return (
    <NavBarContainer data-testid="NavBarContainer">
      <NavBarContent
        key={'blue'}
        data-testid="NavBarContent"
        background={'blue'}
      >
        <UserNavContent />
      </NavBarContent>
    </NavBarContainer>
  );
}

export function NavBarFallback() {
  return (
    <NavBarContainer data-testid="NavBarContainer">
      <NavBarContent
        key={'blue'}
        data-testid="NavBarContent"
        background={'blue'}
      >
        <NavColumn data-testid="column-placeholder" />
        <Logo />
        <NavColumn data-testid="column-placeholder" />
      </NavBarContent>
    </NavBarContainer>
  );
}
