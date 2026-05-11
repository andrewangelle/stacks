import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { useAuthPathname } from '~/auth/useAuthPathname';

type AuthLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export function AuthLink({ href, className, children }: AuthLinkProps) {
  const pathname = useAuthPathname();
  if (pathname) {
    return (
      <Link to="/auth/$pathname" params={{ pathname }} className={className}>
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
