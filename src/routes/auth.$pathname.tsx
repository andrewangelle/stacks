import { AuthView } from '@neondatabase/neon-js/auth/react';
import { createFileRoute } from '@tanstack/react-router';
import { NavBar } from '~/components/NavBar';
import { FlexCenter } from '~/styles/Page';

export const Route = createFileRoute('/auth/$pathname')({
  component: AuthPage,
});

function AuthPage() {
  const { pathname } = Route.useParams();

  return (
    <>
      <NavBar />
      <FlexCenter>
        <AuthView pathname={pathname} />
      </FlexCenter>
    </>
  );
}
