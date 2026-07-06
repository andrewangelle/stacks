import { NavBarContainer, NavBarContent } from '~/components/Nav/Nav.styled';
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
