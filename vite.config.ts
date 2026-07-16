import netlify from '@netlify/vite-plugin-tanstack-start';
import { pigment } from '@pigment-css/vite-plugin';
import viteReact from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";
import rsc from '@vitejs/plugin-rsc'

dotenv.config();

const sentryDsn = process.env.VITE_SENTRY_DSN;

export default defineConfig({
  server: {
    port: 3000,
  },

  optimizeDeps: {
    include: ['react-is', '@mui/utils/deepmerge', '@pigment-css/react'],
    // pg and @prisma/client are server-only. Excluding them stops Vite's client
    // dep scanner from discovering them mid-session and triggering a re-optimize +
    // full reload, which tears down the shared optimized React/pigment chunks and
    // causes transient "Invalid hook call" and stale-chunk ENOENT errors.
    // Radix keeps its dismissable-layer stack in a module-level context, so the
    // optimizer inlining a second copy into another prebundled chunk gives the
    // Dialog and the Popover separate layer sets — each then reads as the top
    // layer and Escape closes both. Leaving it unbundled keeps one instance.
    exclude: ['pg', '@prisma/client', '@radix-ui/react-dismissable-layer'],
  },

  ssr: {
    // Bundle react-icons for SSR — Node otherwise loads .esm.js as CJS and throws
    // "Cannot use import statement outside a module" on Netlify.
    noExternal: ['react-is', '@mui/utils', '@pigment-css/react', 'react-icons'],
    optimizeDeps: {
      include: [
        'react-is',
        '@mui/utils/deepmerge',
        '@pigment-css/react',
        'react-icons',
      ],
    },

    // The pg package optionally tries to import pg-native (a native C++ PostgreSQL client), 
    // and Vite chokes on it because pg-native isn't installed and
    // Vite can't resolve optional peer deps the same way Node.js can.
    external: ['@prisma/client', 'pg'],
  },

  resolve: {
    tsconfigPaths: true,
    alias: {
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',

      // The pg package optionally tries to import pg-native (a native C++ PostgreSQL client), 
      // and Vite chokes on it because pg-native isn't installed and
      // Vite can't resolve optional peer deps the same way Node.js can.
      'pg-native': '/dev/null',
    },
  },
  plugins: [
    tanstackStart({
      rsc: {
        enabled: true
      }
    }),
    netlify(),
    pigment({}),
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
