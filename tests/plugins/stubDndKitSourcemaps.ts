import { existsSync, readdirSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import type { Plugin } from 'vite';

const EMPTY_MAP = '{"version":3,"sources":[],"names":[],"mappings":""}';

const DND_KIT_PACKAGES = ['@dnd-kit/react', '@dnd-kit/dom'];

function stubPackageSourcemaps(require: NodeRequire, pkgName: string) {
  const pkgDir = dirname(require.resolve(pkgName));

  for (const file of readdirSync(pkgDir)) {
    if (!file.endsWith('.js')) continue;
    const mapPath = join(pkgDir, `${file}.map`);
    if (!existsSync(mapPath)) {
      writeFileSync(mapPath, EMPTY_MAP);
    }
  }
}

/**
 * @dnd-kit packages reference .map files that are not published. Vite SSR logs
 * ENOENT for each one; write minimal stubs once the e2e dev server starts.
 */
export function stubDndKitSourcemaps(): Plugin {
  return {
    name: 'e2e-stub-dnd-kit-sourcemaps',
    buildStart() {
      const require = createRequire(import.meta.url);

      for (const pkgName of DND_KIT_PACKAGES) {
        stubPackageSourcemaps(require, pkgName);
      }
    },
  };
}
