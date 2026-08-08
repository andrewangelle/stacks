import { Logo } from '~/components/Nav/Logo';
import {
  NavBarContainer,
  NavBarContent,
  NavColumn,
} from '~/components/Nav/Nav.styled';
import { UserNavContent } from '~/components/Nav/UserNavContent';

export function NavBarClient() {
  return (
    <NavBarContainer>
      <NavBarContent key={'blue'} $background={'blue'}>
        <UserNavContent />
      </NavBarContent>
    </NavBarContainer>
  );
}

export function NavBarFallback() {
  return (
    <NavBarContainer>
      <NavBarContent key={'blue'} $background={'blue'}>
        <NavColumn />
        <Logo />
        <NavColumn />
      </NavBarContent>
    </NavBarContainer>
  );
}
