import { Show, SignIn, UserButton } from '@clerk/tanstack-react-start';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { NavBarClient } from '~/components/Nav/NavBarClient';
import { FlexCenter } from '~/styles/Page.styled';

export const Route = createFileRoute('/auth/sign-in')({
  loader({ context }) {
    if (context.userId) {
      throw redirect({ to: '/boards' });
    }
  },

  component() {
    return (
      <>
        <NavBarClient />

        <FlexCenter data-testid="FlexCenter">
          <Show when="signed-in">
            <UserButton />
          </Show>

          <Show when="signed-out">
            <SignIn />
          </Show>
        </FlexCenter>
      </>
    );
  },
});
