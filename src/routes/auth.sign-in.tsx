import { Show, SignIn, UserButton } from '@clerk/tanstack-react-start';
import { createFileRoute, redirect } from '@tanstack/react-router';
import { NavBarClient } from '~/components/Nav/NavBarClient';
import * as styles from '~/styles/Page.css';

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

        <div className={styles.flexCenter} data-testid="FlexCenter">
          <Show when="signed-in">
            <UserButton />
          </Show>

          <Show when="signed-out">
            <SignIn />
          </Show>
        </div>
      </>
    );
  },
});
