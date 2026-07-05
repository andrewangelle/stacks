import { Show, SignIn, UserButton } from '@clerk/tanstack-react-start';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { NavFallback } from '~/components/Nav/NavFallback';
import { fetchUserId } from '~/middleware/auth';
import { FlexCenter } from '~/styles/Page.styled';

export const Route = createFileRoute('/auth/sign-in')({
  async beforeLoad() {
    const { userId } = await fetchUserId();
    return { userId };
  },

  loader({ context }) {
    if (context.userId) {
      throw redirect({ to: '/boards' });
    }
  },

  component() {
    return (
      <>
        <NavFallback />

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
