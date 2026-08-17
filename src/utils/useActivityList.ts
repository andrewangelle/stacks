import { useLocation } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { startTransition, useEffect, useRef } from 'react';
import type { ActivityPayload } from '~/db/activity/activity.cache';
import {
  useGetActivity,
  useGetComments,
  useGetFirstActivity,
} from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { getHashId } from '~/utils/useScrollToHashId';

/**
 * Rows are measured after they mount, so this only has to be close enough to
 * keep the initial scrollbar honest.
 */
const ESTIMATED_ROW_HEIGHT = 72;
const OVERSCAN = 6;
const LOADER_KEY = 'activity-list-loader';

/**
 * The rows the list renders, oldest last: the entries for the current view,
 * then the skeleton row (`null`) while more pages remain, then the card's very
 * first entry.
 *
 * That first entry records the card's creation and is pinned in every view —
 * the comments-only view filters it out, and the full feed has not necessarily
 * paginated back far enough to have loaded it. It is dropped when it is already
 * among the entries, which is the steady state once every page is loaded.
 */
function withPinnedFirstEntry(
  entries: ActivityPayload[],
  firstEntry: ActivityPayload | null | undefined,
  hasNextPage: boolean,
) {
  const rows: (ActivityPayload | null)[] = [...entries];

  if (hasNextPage) {
    rows.push(null);
  }

  if (firstEntry && !entries.some((entry) => entry.id === firstEntry.id)) {
    rows.push(firstEntry);
  }

  return rows;
}

export function useActivityList({ showActivity }: { showActivity: boolean }) {
  const cardId = useCurrentCardId();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetActivity({ cardId });
  const { data: comments } = useGetComments({ cardId });
  const { data: firstEntry } = useGetFirstActivity({ cardId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const entries = showActivity ? data : (comments ?? []);
  const rows = withPinnedFirstEntry(entries, firstEntry, hasNextPage);

  const { getVirtualItems, scrollToIndex, getTotalSize, measureElement } =
    useVirtualizer({
      count: rows.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => ESTIMATED_ROW_HEIGHT,
      getItemKey: (index) => rows[index]?.id ?? LOADER_KEY,
      overscan: OVERSCAN,
    });

  const virtualRows = getVirtualItems();
  const lastEntry = virtualRows[virtualRows.length - 1];
  const hasScrolledToLoader =
    !!lastEntry && lastEntry.index >= entries.length - 1;

  // A deep link can point at an entry that is loaded but scrolled out of the
  // rendered window, where the per-entry `scrollIntoView` never runs because
  // the element was never mounted. Bring it into the window first.
  const deepLinkedId = getHashId(location.hash);
  const deepLinkedIndex = deepLinkedId
    ? rows.findIndex((entry) => entry?.id === deepLinkedId)
    : -1;

  // The link can also point past the loaded pages entirely,
  const isDeepLinkedAndMissing = deepLinkedId !== '' && deepLinkedIndex === -1;

  useEffect(() => {
    const shouldFetch = hasScrolledToLoader || isDeepLinkedAndMissing;

    if (shouldFetch && hasNextPage && !isFetchingNextPage) {
      // A suspense query re-suspends while it fetches, so outside a transition
      // this would drop the loaded entries for a screen of skeletons on every
      // page. In a transition React keeps them up until the page arrives.
      startTransition(() => {
        fetchNextPage();
      });
    }
  }, [
    hasScrolledToLoader,
    isDeepLinkedAndMissing,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  ]);

  useEffect(() => {
    if (deepLinkedIndex >= 0) {
      scrollToIndex(deepLinkedIndex, { align: 'center' });
    }
  }, [deepLinkedIndex, scrollToIndex]);

  return {
    list: rows,
    rows: virtualRows,
    scrollRef,
    getTotalSize,
    measureElement,
  };
}
