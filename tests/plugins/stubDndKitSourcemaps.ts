import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import type { Plugin } from 'vite';

const EMPTY_MAP = '{"version":3,"sources":[],"names":[],"mappings":""}';

/**
 * @dnd-kit/react references .map files that are not published. Vite SSR logs
 * ENOENT for each one; write minimal stubs once the e2e dev server starts.
 */
export function stubDndKitSourcemaps(): Plugin {
  return {
    name: 'e2e-stub-dnd-kit-sourcemaps',
    buildStart() {
      const require = createRequire(import.meta.url);
      const pkgDir = path.dirname(require.resolve('@dnd-kit/react'));

      for (const file of fs.readdirSync(pkgDir)) {
        if (!file.endsWith('.js')) continue;
        const mapPath = path.join(pkgDir, `${file}.map`);
        if (!fs.existsSync(mapPath)) {
          fs.writeFileSync(mapPath, EMPTY_MAP);
        }
      }
    },
  };
}
