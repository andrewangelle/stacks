import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { RecoilRoot } from 'recoil';
import type { ReactNode } from 'react';
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
          <RecoilRoot>
            <DndProvider backend={HTML5Backend}>
              {children}
              <Scripts />
              <GlobalFonts />
            </DndProvider>
          </RecoilRoot>
        </QueryClientProvider>
      </body>
    </html>
  );
}
