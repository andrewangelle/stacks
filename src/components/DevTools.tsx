import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useCallback } from 'react';

type PointerDownOutsideEvent = CustomEvent<{
  originalEvent: PointerEvent;
}>;
export function usePreventDevToolsClose() {
  return useCallback((event: PointerDownOutsideEvent) => {
    if (
      import.meta.env.DEV &&
      event.target instanceof Element &&
      event.target.closest('.tsqd-parent-container')
    ) {
      event.preventDefault();
    }
  }, []);
}

export function DevTools() {
  if (import.meta.env.PROD || import.meta.env.VITE_E2E) {
    return null;
  }

  return (
    <div style={{ pointerEvents: 'auto' }}>
      <ReactQueryDevtools />
      <TanStackRouterDevtools />
    </div>
  );
}
