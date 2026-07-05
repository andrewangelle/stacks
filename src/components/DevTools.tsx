import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { lazy, Suspense } from 'react';

function createDevTools() {
  if (process.env.NODE_ENV === 'production') {
    return () => null;
  }

  return lazy(() =>
    import('@tanstack/react-router-devtools').then((res) => ({
      default: res.TanStackRouterDevtools,
    })),
  );
}

const TanStackRouterDevtools = createDevTools();

export function DevTools() {
  if (import.meta.env.VITE_E2E) {
    return null;
  }

  return (
    <>
      <ReactQueryDevtools />
      <Suspense fallback={null}>
        <TanStackRouterDevtools />
      </Suspense>
    </>
  );
}
