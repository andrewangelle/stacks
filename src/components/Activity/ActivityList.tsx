import { useLocation } from '@tanstack/react-router';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useRef } from 'react';
import {
  ActivityListContainer,
  ActivityListRow,
  ActivityListViewport,
} from '~/components/Activity/Activity.styled';
import { ActivityComment } from '~/components/Activity/ActivityComment';
import { ActivityEntry } from '~/components/Activity/ActivityEntry';
import { ActivityEntrySkeleton } from '~/components/Activity/ActivitySkeleton';
import type { ActivityPayload } from '~/db/activity/activity.cache';
import { getHashId } from '~/utils/useScrollToHashId';

/**
 * Rows are measured after they mount, so this only has to be close enough to
 * keep the initial scrollbar honest.
 */
const ESTIMATED_ROW_HEIGHT = 72;
const OVERSCAN = 6;
const LOADER_KEY = 'activity-list-loader';

type ActivityListProps = {
  entries: ActivityPayload[];
  selectedActivityId: string | null;
  onSelect: (activityId: string) => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  fetchNextPage: () => void;
};

export function ActivityList({
  entries,
  selectedActivityId,
  onSelect,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}: ActivityListProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const location = useLocation();

  // One trailing skeleton row stands in for the next page, so reaching it is
  // both the fetch trigger and the pending indicator.
  const rowCount = hasNextPage ? entries.length + 1 : entries.length;

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => ESTIMATED_ROW_HEIGHT,
    getItemKey: (index) => entries[index]?.id ?? LOADER_KEY,
    overscan: OVERSCAN,
  });

  const virtualRows = virtualizer.getVirtualItems();
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
      virtualizer.scrollToIndex(hashIndex, { align: 'center' });
    }
  }, [hashIndex, virtualizer]);

  return (
    <ActivityListViewport ref={scrollRef} data-testid="ActivityListViewport">
      <ActivityListContainer
        data-testid="ActivityListContainer"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualRows.map((virtualRow) => {
          const entry = entries[virtualRow.index];
          return (
            <ActivityListRow
              key={virtualRow.key}
              data-index={virtualRow.index}
              ref={virtualizer.measureElement}
              style={{ transform: `translateY(${virtualRow.start}px)` }}
            >
              {!entry && <ActivityEntrySkeleton />}

              {entry && entry.type === 'feed' && (
                <ActivityEntry
                  id={entry.id}
                  isSelected={selectedActivityId === entry.id}
                  onSelect={() => onSelect(entry.id)}
                />
              )}

              {entry && entry.type === 'comment' && (
                <ActivityComment
                  id={entry.id}
                  isSelected={selectedActivityId === entry.id}
                  onSelect={() => onSelect(entry.id)}
                />
              )}
            </ActivityListRow>
          );
        })}
      </ActivityListContainer>
    </ActivityListViewport>
  );
}
