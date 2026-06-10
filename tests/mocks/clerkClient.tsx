import type { ReactNode } from 'react';
import { getStore } from '~test/mocks/memoryPrisma';

export function useUser() {
  const clerkUser = getStore().clerkUser;

  return {
    isLoaded: true,
    isSignedIn: clerkUser !== null,
    user: clerkUser,
  };
}

type ShowProps = {
  when: 'signed-in' | 'signed-out';
  children: ReactNode;
};

export function ClerkProvider({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

export function Show({ when, children }: ShowProps) {
  if (when === 'signed-in') {
    return <>{children}</>;
  }
  return null;
}

export function SignIn() {
  return null;
}

export function UserButton() {
  return <div data-testid="UserButton" />;
}
