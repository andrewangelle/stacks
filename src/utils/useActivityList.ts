import { useLocation } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import { useGetActivity, useGetComments } from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { getHashId } from '~/utils/useScrollToHashId';

/**
 * Rows are measured after they mount, so this only has to be close enough to
 * keep the initial scrollbar honest.
 */
const ESTIMATED_ROW_HEIGHT = 72;
const OVERSCAN = 6;
const LOADER_KEY = 'activity-list-loader';

export function useActivityList({ showActivity }: { showActivity: boolean }) {
  const cardId = useCurrentCardId();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetActivity({ cardId });
  const { data: comments } = useGetComments({ cardId });
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const entries = showActivity ? data : (comments ?? []);

  const { getVirtualItems, scrollToIndex, getTotalSize, measureElement } =
    useVirtualizer({
      // One trailing skeleton row is the + 1
      count: hasNextPage ? entries.length + 1 : entries.length,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => ESTIMATED_ROW_HEIGHT,
      getItemKey: (index) => entries[index]?.id ?? LOADER_KEY,
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
    ? entries.findIndex((entry) => entry.id === deepLinkedId)
    : -1;

  // The link can also point past the loaded pages entirely,
  const isDeepLinkedAndMissing = deepLinkedId !== '' && deepLinkedIndex === -1;

  useEffect(() => {
    const shouldFetch = hasScrolledToLoader || isDeepLinkedAndMissing;

    if (shouldFetch && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
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
    list: entries,
    rows: virtualRows,
    scrollRef,
    getTotalSize,
    measureElement,
  };
}
