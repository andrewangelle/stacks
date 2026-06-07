import { useLocation } from '@tanstack/react-router';

const CHECKLIST_HASH_PREFIX = 'checklist-';

export function useHashChecklistId() {
  const { hash } = useLocation();

  return hash.startsWith(CHECKLIST_HASH_PREFIX)
    ? hash.slice(CHECKLIST_HASH_PREFIX.length)
    : undefined;
}
