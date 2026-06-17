import { useLocation } from '@tanstack/react-router';
import { type RefObject, useEffect } from 'react';

export function useScrollToHashId(
  id: string,
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const location = useLocation();

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;

    const hashId = getHashId(location.hash);

    if (enabled && hashId === id) {
      timer = setTimeout(() => {
        ref.current?.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }

    return () => clearTimeout(timer);
  }, [location.hash, id, enabled, ref]);
}

function getHashId(hash: string | undefined): string {
  return hash?.match(/\w+-(.+)/)?.[1] ?? '';
}
