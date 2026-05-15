import { Show, SignIn, UserButton } from '@clerk/tanstack-react-start';
import { createFileRoute } from '@tanstack/react-router';
import { NavBar } from '~/components/NavBar';
import { FlexCenter } from '~/styles/Page';

export const Route = createFileRoute('/auth/sign-in')({
  component() {
    return (
      <>
        <NavBar />
        <FlexCenter>
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
