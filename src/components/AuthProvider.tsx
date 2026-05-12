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
      navigate={(_) => {
        void router.navigate({
          to: '/auth/sign-in',
        });
      }}
      redirectTo="/boards"
      social={{ providers: ['google'] }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
