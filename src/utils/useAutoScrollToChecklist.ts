import { useLocation } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { useGetChecklists } from '~/query/checklists';

const MAX_SCROLL_ATTEMPTS = 30;
const SCROLL_DELAY_MS = 350;

function getScrollContainer(element: HTMLElement | null) {
  let current = element?.parentElement ?? null;

  while (current) {
    const { overflowY } = getComputedStyle(current);

    if (overflowY === 'auto' || overflowY === 'scroll') {
      return current;
    }

    current = current.parentElement;
  }

  return null;
}

function scrollChecklistIntoView(
  scrollContainer: HTMLElement,
  targetElement: HTMLElement,
  onScroll: () => void,
) {
  scrollContainer.scrollTop = 0;

  return window.setTimeout(() => {
    const containerRect = scrollContainer.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();
    const offsetTop =
      targetRect.top - containerRect.top + scrollContainer.scrollTop;

    scrollContainer.scrollTo({
      top: offsetTop,
      behavior: 'smooth',
    });
    onScroll();
  }, SCROLL_DELAY_MS);
}

export function useAutoScrollToChecklist({
  cardId,
  scrollToChecklistId,
}: {
  cardId: string;
  scrollToChecklistId?: string;
}) {
  const location = useLocation();
  console.log(location.hash);
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

    const targetChecklist = data.find(
      (checklist) => checklist.id === scrollToChecklistId,
    );

    if (!targetChecklist) {
      return;
    }

    let cancelled = false;
    let attempts = 0;
    let scrollTimeoutId: number | undefined;

    function tryScroll() {
      if (cancelled) {
        return;
      }

      const targetElement = ref.current?.querySelector<HTMLElement>(
        `[data-checklist-id="${scrollToChecklistId}"]`,
      );

      if (targetElement) {
        const scrollContainer = getScrollContainer(targetElement);

        if (scrollContainer) {
          scrollTimeoutId = scrollChecklistIntoView(
            scrollContainer,
            targetElement,
            () => {
              scrolledToChecklistIdRef.current = scrollToChecklistId;
            },
          );
        }

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
        window.clearTimeout(scrollTimeoutId);
      }
    };
  }, [data, scrollToChecklistId]);

  return {
    ref,
  };
}
