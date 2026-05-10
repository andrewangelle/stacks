import { QueryClientProvider } from '@tanstack/react-query';
import '@neondatabase/neon-js/ui/css';
import '@pigment-css/react/styles.css';
import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useRouter,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { authClient } from '~/auth/client';
import { queryClient } from '~/store/queryClient';
import GlobalFonts from '~/styles/GlobalFonts';

const AUTH_PATH_SEGMENTS = /^\/auth\/([^/?#]+)/;

function NeonAuthLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  const m = AUTH_PATH_SEGMENTS.exec(href);
  if (m) {
    return (
      <Link
        to="/auth/$pathname"
        params={{ pathname: m[1] }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <Link to={href as never} className={className}>
      {children}
    </Link>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Stacks' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <NeonAuthShell>
        <Outlet />
      </NeonAuthShell>
    </RootDocument>
  );
}

function NeonAuthShell({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      credentials={{ forgotPassword: true }}
      Link={NeonAuthLink}
      navigate={(href) => {
        const m = AUTH_PATH_SEGMENTS.exec(href);
        if (m) {
          void router.navigate({
            to: '/auth/$pathname',
            params: { pathname: m[1] },
          });
          return;
        }
        void router.navigate({ to: href as never });
      }}
      redirectTo="/boards"
      social={{ providers: ['google'] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={HTML5Backend}>
            {children}
            <Scripts />
            <GlobalFonts />
          </DndProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
