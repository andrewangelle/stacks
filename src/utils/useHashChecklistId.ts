import { useLocation } from '@tanstack/react-router';

export function useHashChecklistId() {
  const { hash: routerHash } = useLocation();
  const CHECKLIST_HASH_PREFIX = 'checklist-';

  function getScrollToChecklistId(hash: string) {
    const normalizedHash = hash.startsWith('#') ? hash.slice(1) : hash;

    if (!normalizedHash.startsWith(CHECKLIST_HASH_PREFIX)) {
      return undefined;
    }

    return normalizedHash.slice(CHECKLIST_HASH_PREFIX.length);
  }

  function getChecklistHashFromLocation(routerHash: string) {
    if (routerHash) {
      return routerHash;
    }

    if (typeof window === 'undefined') {
      return '';
    }

    return window.location.hash.slice(1);
  }

  return getScrollToChecklistId(getChecklistHashFromLocation(routerHash));
}
