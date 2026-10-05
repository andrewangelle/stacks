import { useRouteContext } from '@tanstack/react-router';

export function useIsMobile() {
  return useRouteContext({ from: '__root__', select: (c) => c.isMobile });
}
