import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';

type AuthLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/** Resolves Neon Auth UI `href` values (e.g. `/auth/sign-up`) to the `$pathname` segment. */
export function authPathnameFromHref(href: string): string | undefined {
  try {
    const path =
      href.startsWith('http://') || href.startsWith('https://')
        ? new URL(href).pathname
        : (href.split('?')[0]?.split('#')[0] ?? href);
    const authPathnameMatch = path.match(/^\/auth\/([^/]+)$/);
    return authPathnameMatch?.[1];
  } catch {
    return undefined;
  }
}

export function AuthLink({ href, className, children }: AuthLinkProps) {
  const authPathname = authPathnameFromHref(href);
  if (authPathname) {
    return (
      <Link
        to="/auth/$pathname"
        params={{ pathname: authPathname }}
        className={className}
      >
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
