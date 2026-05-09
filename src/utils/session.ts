import { useLocation } from '@tanstack/react-router';
import { useMemo } from 'react';
import type { TokenType } from '~/store/atoms';

export function useTokenFromHash() {
  const { hash } = useLocation();
  return useMemo(() => {
    if (!hash) {
      return null;
    }

    return hash
      .split('&')
      .reduce((acc: Record<string, string>, string: string) => {
        const pairs = string.split('=');
        if (pairs[0] === '#access_token') {
          pairs[0] = pairs[0].split('#')[1];
        }
        acc[pairs[0]] = pairs[1];
        return acc;
      }, {}) as unknown as TokenType;
  }, [hash]);
}
