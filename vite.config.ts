import netlify from '@netlify/vite-plugin-tanstack-start';
import { pigment } from '@pigment-css/vite-plugin';
import viteReact from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import { sentryTanstackStart } from "@sentry/tanstackstart-react/vite";

dotenv.config();

export default defineConfig({
  server: {
    port: 3000,
  },
  optimizeDeps: {
    include: ['react-is', '@mui/utils/deepmerge', '@pigment-css/react'],
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
  },
  resolve: {
    tsconfigPaths: true,
    alias: {
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    },
  },
  plugins: [
    tanstackStart(),
    netlify(),
    pigment({}),
    viteReact(),
    sentryTanstackStart({
      org: "andrewangelle",
      project: "stacks",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],
});
