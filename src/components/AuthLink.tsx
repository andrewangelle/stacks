import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

type AuthLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function AuthLink({ className, children }: AuthLinkProps) {
  return (
    <Link to="/auth/sign-in" className={className}>
      {children}
    </Link>
  );
}
