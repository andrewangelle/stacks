import { AuthView } from '@neondatabase/neon-js/auth/react';
import neonAuthStylesheetUrl from '@neondatabase/neon-js/ui/css?url';
import { createFileRoute } from '@tanstack/react-router';
import { NavBar } from '~/components/NavBar';
import { FlexCenter } from '~/styles/Page';

export const Route = createFileRoute('/auth/$pathname')({
  head: () => ({
    links: [{ rel: 'stylesheet', href: neonAuthStylesheetUrl }],
  }),
  component() {
    const { pathname: authPathname } = Route.useParams();
    return (
      <>
        <NavBar />
        <FlexCenter>
          <AuthView pathname={authPathname} />
        </FlexCenter>
      </>
    );
  },
});
