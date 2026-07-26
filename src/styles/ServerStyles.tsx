import { cloneElement, useState } from 'react';
import { ServerStyleSheet } from 'styled-components';

const isServer = typeof document === 'undefined';

/**
 * styled-components v7 only emits inline `<style>` tags on its own inside a
 * real RSC (react-server) environment. TanStack Start renders this tree in the
 * SSR environment, where React still has `createContext`, so the library takes
 * its classic-SSR path: rules accumulate in a sheet and nothing reaches the
 * HTML unless we flush the sheet ourselves.
 */
export function useServerStyleSheet() {
  const [sheet] = useState(() => (isServer ? new ServerStyleSheet() : null));
  return sheet;
}

/**
 * Rendered as the last child of the tree so every styled component above it has
 * already registered its rules. `precedence` makes React 19 hoist the tag into
 * `<head>` while it builds the shell, so the CSS lands ahead of the markup in
 * the streamed document instead of trailing it.
 */
export function ServerStyles({ sheet }: { sheet: ServerStyleSheet | null }) {
  if (!sheet) {
    return null;
  }

  const [styleElement] = sheet.getStyleElement();

  if (!styleElement) {
    return null;
  }

  return cloneElement(styleElement, {
    href: 'styled-components',
    precedence: 'styled-components',
  });
}
