import { Show, UserButton } from '@clerk/tanstack-react-start';
import { Logo } from '~/components/Nav/Logo';
import { NavColumn } from '~/components/Nav/Nav.styled';
import { Padding } from '~/styles/Page.styled';

export function UserNavContent() {
  return (
    <>
      <NavColumn data-testid="column-placeholder" />
      <Logo />

      <NavColumn data-testid="column-placeholder">
        <Show when="signed-in">
          <Padding padding="5px 20px 0px 0px">
            <UserButton />
          </Padding>
        </Show>
      </NavColumn>
    </>
  );
}
