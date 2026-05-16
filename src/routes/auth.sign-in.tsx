import { Show, SignIn, UserButton } from '@clerk/tanstack-react-start';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { fetchUserId } from '~/auth/middleware';
import { NavBar } from '~/components/NavBar';
import { FlexCenter } from '~/styles/Page';

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
        <NavBar />
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
