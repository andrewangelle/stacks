import netlify from '@netlify/vite-plugin-tanstack-start';
import viteReact from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import rsc from '@vitejs/plugin-rsc'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

dotenv.config();

const sentryDsn = process.env.VITE_SENTRY_DSN;

export default defineConfig({
  server: {
    port: 3000,
  },

  optimizeDeps: {
    // pg and @prisma/client are server-only. Excluding them stops Vite's client
    // dep scanner from discovering them mid-session and triggering a re-optimize +
    // full reload, which tears down the shared optimized React chunks and
    // causes transient "Invalid hook call" and stale-chunk ENOENT errors.
    // Radix keeps its dismissable-layer stack in a module-level context, so the
    // optimizer inlining a second copy into another prebundled chunk gives the
    // Dialog and the Popover separate layer sets — each then reads as the top
    // layer and Escape closes both. Leaving it unbundled keeps one instance.
    exclude: ['pg', '@prisma/client', 'radix-ui'],
    include: [
      '@vanilla-extract/recipes/createRuntimeFn'
    ]
  },

  ssr: {
    // Bundle react-icons for SSR — Node otherwise loads .esm.js as CJS and throws
    // "Cannot use import statement outside a module" on Netlify.
    noExternal: ['react-icons'],
    optimizeDeps: {
      include: ['react-icons'],
    },

    // The pg package optionally tries to import pg-native (a native C++ PostgreSQL client), 
    // and Vite chokes on it because pg-native isn't installed and
    // Vite can't resolve optional peer deps the same way Node.js can.
    external: ['@prisma/client', 'pg'],
  },

  resolve: {
    tsconfigPaths: true,
    alias: {
      // The pg package optionally tries to import pg-native (a native C++ PostgreSQL client),
      // and Vite chokes on it because pg-native isn't installed and
      // Vite can't resolve optional peer deps the same way Node.js can.
      'pg-native': '/dev/null',
    },
  },
  plugins: [
    vanillaExtractPlugin(),
    tanstackStart({
      rsc: {
        enabled: true
      }
    }),
    netlify(),
    rsc(),
    viteReact(),
    sentryTanstackStart({
      org: "andrewangelle",
      project: "stacks",
      authToken: process.env.SENTRY_AUTH_TOKEN,
      tunnelRoute: sentryDsn ? { allowedDsns: [sentryDsn] } : true,
    }),
  ],
});
