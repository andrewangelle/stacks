import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';
import baseConfig from './vite.config';
import { resetInMemoryDB } from './tests/plugins/resetInMemoryDB';

const rootDir = path.dirname(fileURLToPath(import.meta.url));

export default mergeConfig(baseConfig, {
  server: {
    port: 3100,
    strictPort: true,
  },
  plugins: [resetInMemoryDB()],
  resolve: {
    alias: {
      '~/db/prisma': path.resolve(rootDir, 'tests/mocks/memoryPrisma.ts'),
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
