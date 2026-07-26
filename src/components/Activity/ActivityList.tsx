import * as styles from '~/components/Activity/Activity.css';
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
    <div
      className={styles.activityListViewport}
      ref={scrollRef}
      data-testid="ActivityListViewport"
    >
      <div
        className={styles.activityListContainer}
        data-testid="ActivityListContainer"
        style={{ height: getTotalSize() }}
      >
        {rows.map((row) => {
          const entry = list[row.index];
          return (
            <div
              className={styles.activityListRow}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
