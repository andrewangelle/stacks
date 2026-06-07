import { useEffect, useRef } from 'react';
import { useGetChecklists } from '~/query/checklists';

const MAX_SCROLL_ATTEMPTS = 30;
const SCROLL_DELAY_MS = 350;

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
    let scrollTimeoutId: NodeJS.Timeout | undefined;

    function tryScroll() {
      if (cancelled) {
        return;
      }

      const targetElement = ref.current?.querySelector<HTMLElement>(
        `[data-checklist-id="${scrollToChecklistId}"]`,
      );

      if (targetElement) {
        scrollTimeoutId = setTimeout(() => {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          scrolledToChecklistIdRef.current = scrollToChecklistId;
        }, SCROLL_DELAY_MS);
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

      if (scrollTimeoutId !== undefined) {
        clearTimeout(scrollTimeoutId);
      }
    };
  }, [data, scrollToChecklistId]);

  return {
    ref,
  };
}
