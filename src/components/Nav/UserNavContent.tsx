import { Show, UserButton } from '@clerk/tanstack-react-start';
import { Logo } from '~/components/Nav/Logo';
import { Padding } from '~/styles/Page.styled';

export function UserNavContent() {
  return (
    <>
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
    </>
  );
}
