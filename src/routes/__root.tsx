import '~/styles/animations.css';
import '~/styles/board-gradient.css';
import '~/styles/drag.css';
import { ClerkProvider } from '@clerk/tanstack-react-start';
import { DragDropProvider } from '@dnd-kit/react';
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router';
import type { ReactNode } from 'react';
import { StyleSheetManager } from 'styled-components';
import { rscPlugin } from 'styled-components/plugins';
import { DevTools } from '~/components/DevTools';
import { fetchUserId } from '~/middleware/auth';
import type { queryClient } from '~/query';
import GlobalFonts from '~/styles/GlobalFonts';
import { ServerStyles, useServerStyleSheet } from '~/styles/ServerStyles';
import { detectMobile } from '~/utils/detectMobile';

type RouterContext = {
  queryClient: typeof queryClient;
};

function Providers({ children }: { children: ReactNode }) {
  const sheet = useServerStyleSheet();

  return (
    <StyleSheetManager plugins={[rscPlugin]} sheet={sheet?.instance}>
      <ClerkProvider>
        <DragDropProvider>{children}</DragDropProvider>
      </ClerkProvider>
      <ServerStyles sheet={sheet} />
    </StyleSheetManager>
  );
}

export const Route = createRootRouteWithContext<RouterContext>()({
  async beforeLoad() {
    const { isMobile } = await detectMobile();
    const { userId } = await fetchUserId();
    return { isMobile, userId };
  },
  head() {
    return {
      link: [
        { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png',
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png',
        },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
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
        </head>
        <body>
          <Providers>
            <Outlet />
            <Scripts />
            <GlobalFonts />
            <DevTools />
          </Providers>
        </body>
      </html>
    );
  },
});
