import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import baseConfig from './vite.config';
import { suppressLogging, createE2ELogger, suppressKnownConsoleNoise } from './tests/plugins/suppressLogging';
import { resetInMemoryDB } from './tests/plugins/resetInMemoryDB';
import { stubDndKitSourcemaps } from './tests/plugins/stubDndKitSourcemaps';

suppressKnownConsoleNoise();

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(baseConfig, {
  define: {
    'import.meta.env.VITE_E2E': JSON.stringify('true'),
  },
  customLogger: createE2ELogger(),
  logLevel: 'error',
  server: {
    port: 3100,
    strictPort: true,
  },
  plugins: [
    stubDndKitSourcemaps(),
    suppressLogging(),
    resetInMemoryDB(),
  ],
  resolve: {
    dedupe: ['react', 'react-dom'],
    alias: {
      '@clerk/tanstack-react-start/server': path.resolve(
        rootDir,
        'tests/mocks/clerkServer.ts',
      ),
      '@clerk/tanstack-react-start': path.resolve(
        rootDir,
        'tests/mocks/clerkClient.tsx',
      ),
    },
    tsconfigPaths: true,
  },
});
