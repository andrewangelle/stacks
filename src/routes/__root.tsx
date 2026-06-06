import { type QueryClient, QueryClientProvider } from '@tanstack/react-query';
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
import { DevTools } from '~/components/DevTools';
import { NavBar } from '~/components/Nav/NavBar';
import { queryClient } from '~/query/queryClient';
import GlobalFonts from '~/styles/GlobalFonts';

type RouterContext = {
  queryClient: QueryClient;
};

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
      <ClerkProvider>
        <RootDocument>
          <Outlet />
        </RootDocument>
      </ClerkProvider>
    );
  },
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <DragDropProvider>
            <NavBar />
            {children}
            <Scripts />
            <GlobalFonts />
            <DevTools />
          </DragDropProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
