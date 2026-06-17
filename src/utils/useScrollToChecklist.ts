import { useLocation } from '@tanstack/react-router';
import { type RefObject, useEffect } from 'react';

// Scrolls the referenced element into view when the current URL hash deep-links
// to the given activity id (e.g. opening a copied `#checklist-<id>` link). The
// `enabled` flag defers scrolling until the entry's data has loaded and the
// element is actually mounted.
export function useScrollToChecklist(
  id: string,
  ref: RefObject<HTMLElement | null>,
  enabled: boolean,
) {
  const location = useLocation();

  useEffect(() => {
    const [, checklistId = ''] = location.hash?.split('checklist-') ?? [];

    if (!enabled || checklistId !== id) {
      return;
    }

    const timer = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 350);

    return () => clearTimeout(timer);
  }, [location.hash, id, enabled, ref]);
}
