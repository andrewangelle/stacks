import { useEffect, useRef } from 'react';
import { useGetChecklists } from '~/query/checklists';

const MAX_SCROLL_ATTEMPTS = 30;

export function useAutoScrollToChecklist({
  cardId,
  scrollToChecklistId,
}: {
  cardId: string;
  scrollToChecklistId?: string;
}) {
  const { data } = useGetChecklists({ cardId });
  const ref = useRef<HTMLDivElement>(null);
  const scrolledToChecklistIdRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!scrollToChecklistId || !data?.length) {
      return;
    }

    if (scrolledToChecklistIdRef.current === scrollToChecklistId) {
      return;
    }

    let cancelled = false;
    let attempts = 0;

    function tryScroll() {
      if (cancelled) {
        return;
      }

      const targetElement = ref.current?.querySelector<HTMLElement>(
        `[data-checklist-id="${scrollToChecklistId}"]`,
      );

      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        scrolledToChecklistIdRef.current = scrollToChecklistId;
        return;
      }

      attempts += 1;

      if (attempts < MAX_SCROLL_ATTEMPTS) {
        requestAnimationFrame(tryScroll);
      }
    }

    requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
    };
  }, [data, scrollToChecklistId]);

  return {
    ref,
  };
}
