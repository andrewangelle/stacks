import '~/styles/animations.css';
import '~/styles/board-gradient.css';
import '~/styles/drag.css';
import '@pigment-css/react/styles.css';
import { ClerkProvider } from '@clerk/tanstack-react-start';
import { DragDropProvider } from '@dnd-kit/react';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { Suspense } from 'react';
import { DevTools } from '~/components/DevTools';
import { NavBarFallback } from '~/components/Nav/NavBarClient';
import type { queryClient } from '~/query';
import GlobalFonts from '~/styles/GlobalFonts';

type RouterContext = {
  queryClient: typeof queryClient;
};

function Providers({ children }: { children: ReactNode }) {
  return (
    <ClerkProvider>
      <DragDropProvider>{children}</DragDropProvider>
    </ClerkProvider>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  head() {
    return {
      meta: [
        { charSet: 'utf-8' },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
        { title: 'Stacks' },
      ],
    };
  },
  component() {
    return (
      <html lang="en">
        <head>
          <HeadContent />
          <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        </head>
        <body>
          <Suspense fallback={<NavBarFallback />}>
            <Providers>
              <Outlet />
              <Scripts />
              <GlobalFonts />
              <DevTools />
            </Providers>
          </Suspense>
        </body>
      </html>
    );
  },
});
