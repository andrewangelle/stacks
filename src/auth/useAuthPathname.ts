import { useLocation } from '@tanstack/react-router';

export function useAuthPathname() {
  const params = useLocation();
  const [_, pathname] = params.pathname.split('/auth/');

  return pathname;
}
