import '~/styles/animations.css';
import '~/styles/board-gradient.css';
import '~/styles/drag.css';
import '~/styles/global.css';
import '~/styles/stylesheets';
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
import { fetchUserId } from '~/middleware/auth';
import type { queryClient } from '~/query';
import { detectMobile } from '~/utils/detectMobile';

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
            <DevTools />
          </Providers>
        </body>
      </html>
    );
  },
});
