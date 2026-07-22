import {
  ActivityListContainer,
  ActivityListRow,
  ActivityListViewport,
} from '~/components/Activity/Activity.styled';
import { ActivityComment } from '~/components/Activity/ActivityComment';
import { ActivityEntry } from '~/components/Activity/ActivityEntry';
import { ActivityEntrySkeleton } from '~/components/Activity/ActivitySkeleton';
import { useActivityList } from '~/utils/useActivityList';

type ActivityListProps = {
  showActivity: boolean;
  selectedActivityId: string | null;
  onSelect: (activityId: string) => void;
};

export function ActivityList({
  showActivity,
  selectedActivityId,
  onSelect,
}: ActivityListProps) {
  const { scrollRef, list, rows, getTotalSize, measureElement } =
    useActivityList({ showActivity });
  return (
    <ActivityListViewport ref={scrollRef} data-testid="ActivityListViewport">
      <ActivityListContainer
        data-testid="ActivityListContainer"
        style={{ height: getTotalSize() }}
      >
        {rows.map((row) => {
          const entry = list[row.index];
          return (
            <ActivityListRow
              key={row.key}
              data-index={row.index}
              ref={measureElement}
              style={{ transform: `translateY(${row.start}px)` }}
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
