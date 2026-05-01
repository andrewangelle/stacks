import netlify from '@netlify/vite-plugin-tanstack-start';
import { pigment } from '@pigment-css/vite-plugin';
import viteReact from '@vitejs/plugin-react';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import tsConfigPaths from 'vite-tsconfig-paths';

dotenv.config();

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      'react/jsx-runtime.js': 'react/jsx-runtime',
      'react/jsx-dev-runtime.js': 'react/jsx-dev-runtime',
    },
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    pigment({}),
    tanstackStart(),
    netlify(),
    viteReact(),
  ],
});
