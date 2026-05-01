import { QueryClientProvider } from '@tanstack/react-query';
import '@pigment-css/react/styles.css';
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import { Provider as JotaiProvider } from 'jotai';
import type { ReactNode } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { queryClient } from '~/store/queryClient';
import GlobalFonts from '~/styles/GlobalFonts';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Stacks' },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <JotaiProvider>
            <DndProvider backend={HTML5Backend}>
              {children}
              <Scripts />
              <GlobalFonts />
            </DndProvider>
          </JotaiProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
