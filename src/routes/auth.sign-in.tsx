import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
  useUser,
} from '@clerk/tanstack-react-start';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { authStateFn } from '~/auth/middleware';
import { NavBar } from '~/components/NavBar';
import { FlexCenter } from '~/styles/Page';

export const Route = createFileRoute('/auth/sign-in')({
  async beforeLoad() {
    const { userId } = await authStateFn();
    return { userId };
  },
  loader({ context }) {
    if (context.userId) {
      throw redirect({ to: '/boards' });
    }
  },
  component() {
    const { user } = useUser();
    console.log({ user });
    return (
      <>
        <NavBar />
        <FlexCenter>
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <SignInButton />
            <SignUpButton />
          </Show>
        </FlexCenter>
      </>
    );
  },
});
