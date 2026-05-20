import { QueryClientProvider } from '@tanstack/react-query';
import '~/styles/animations.css';
import '~/styles/board-gradient.css';
import '@pigment-css/react/styles.css';
import { ClerkProvider } from '@clerk/tanstack-react-start';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { queryClient } from '~/query/queryClient';
import GlobalFonts from '~/styles/GlobalFonts';

export const Route = createRootRoute({
  head() {
    return {
      meta: [
        { charSet: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
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
          <DndProvider backend={HTML5Backend}>
            {children}
            <Scripts />
            <GlobalFonts />
          </DndProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
