import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { authClient } from '~/auth/client';
import { AuthLink } from '~/components/AuthLink';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      credentials={{ forgotPassword: true }}
      Link={AuthLink}
      navigate={(href) => {
        const AUTH_PATH_SEGMENTS = /^\/auth\/([^/?#]+)/;
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
