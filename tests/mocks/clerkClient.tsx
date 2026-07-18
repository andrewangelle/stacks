import type { ReactNode } from 'react';
import { TEST_CLERK_USER } from '~test/mocks/constants';

export function useUser() {
  return {
    isLoaded: true,
    isSignedIn: true,
    user: TEST_CLERK_USER,
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
