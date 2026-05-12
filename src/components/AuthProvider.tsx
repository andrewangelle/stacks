import { NeonAuthUIProvider } from '@neondatabase/neon-js/auth/react';
import { useRouter } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { authClient } from '~/auth/client';
import { AuthLink, authPathnameFromHref } from '~/components/AuthLink';

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <NeonAuthUIProvider
      authClient={authClient}
      credentials={{ forgotPassword: true }}
      Link={AuthLink}
      navigate={(href) => {
        const authPathname = authPathnameFromHref(href) ?? 'sign-in';
        void router.navigate({
          to: '/auth/$pathname',
          params: { pathname: authPathname },
        });
      }}
      redirectTo="/boards"
      social={{ providers: ['google'] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
