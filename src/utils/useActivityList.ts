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

  // One trailing skeleton row stands in for the next page, so reaching it is
  // both the fetch trigger and the pending indicator.
  const rowCount = hasNextPage ? entries.length + 1 : entries.length;

  const { getVirtualItems, scrollToIndex, getTotalSize, measureElement } =
    useVirtualizer({
      count: rowCount,
      getScrollElement: () => scrollRef.current,
      estimateSize: () => ESTIMATED_ROW_HEIGHT,
      getItemKey: (index) => entries[index]?.id ?? LOADER_KEY,
      overscan: OVERSCAN,
    });

  const virtualRows = getVirtualItems();
  const lastVirtualRow = virtualRows[virtualRows.length - 1];
  const hasScrolledToLoader =
    !!lastVirtualRow && lastVirtualRow.index >= entries.length - 1;

  // A deep link can point at an entry that is loaded but scrolled out of the
  // rendered window, where the per-entry `scrollIntoView` never runs because
  // the element was never mounted. Bring it into the window first.
  const hashId = getHashId(location.hash);
  const hashIndex = hashId
    ? entries.findIndex((entry) => entry.id === hashId)
    : -1;

  useEffect(() => {
    if (hasScrolledToLoader && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasScrolledToLoader, hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (hashIndex >= 0) {
      scrollToIndex(hashIndex, { align: 'center' });
    }
  }, [hashIndex, scrollToIndex]);

  return {
    list: entries,
    rows: virtualRows,
    scrollRef,
    getTotalSize,
    measureElement,
  };
}
