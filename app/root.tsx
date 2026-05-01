import type { MetaFunction } from '@remix-run/react';
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from '@remix-run/react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Provider } from 'react-redux';
import { RecoilRoot } from 'recoil';
import { createStore } from '~/store';
import GlobalFonts from './styles/GlobalFonts';

const store = createStore();

export const meta: MetaFunction = () => {
  return { title: 'Stacks' };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {typeof document === 'undefined' ? '__STYLES__' : null}
      </head>
      <body>
        <Provider store={store}>
          <RecoilRoot>
            <DndProvider backend={HTML5Backend}>
              <Outlet />
              <ScrollRestoration />
              <Scripts />
              <GlobalFonts />
              <LiveReload />
            </DndProvider>
          </RecoilRoot>
        </Provider>
      </body>
    </html>
  );
}
