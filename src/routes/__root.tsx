import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from '@tanstack/react-router';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { RecoilRoot } from 'recoil';
import type { ReactNode } from 'react';
import { createStore } from '~/store';
import GlobalFonts from '~/styles/GlobalFonts';

const store = createStore();

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

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Provider store={store}>
          <RecoilRoot>
            <DndProvider backend={HTML5Backend}>
              {children}
              <Scripts />
              <GlobalFonts />
            </DndProvider>
          </RecoilRoot>
        </Provider>
      </body>
    </html>
  );
}
