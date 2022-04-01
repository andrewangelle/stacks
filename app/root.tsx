import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "remix";
import type { MetaFunction } from "remix";
import GlobalFonts from "./styles/GlobalFonts";
import { RecoilRoot } from "recoil";
import {Provider} from 'react-redux';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import {createStore} from '~/store';

const store = createStore();

export const meta: MetaFunction = () => {
  return { title: "Stacks" };
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
        {typeof document === "undefined"
          ? "__STYLES__"
          : null}
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
