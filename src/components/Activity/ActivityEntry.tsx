import { useUser } from '@clerk/tanstack-react-start';
import { useRef } from 'react';
import * as styles from '~/components/Activity/Activity.css';
import { ActivityLinkTemplate } from '~/components/Activity/ActivityLinkTemplate';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { ActivityTimestamp } from '~/components/Activity/ActivityTimestamp';
import { useGetActivityById } from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { useScrollToHashId } from '~/utils/useScrollToHashId';

type ActivityEntryProps = {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function ActivityEntry({
  id,
  isSelected,
  onSelect,
}: ActivityEntryProps) {
  const cardId = useCurrentCardId();
  const { user } = useUser();
  const { isLoading, data } = useGetActivityById({ activityId: id, cardId });
  const ref = useRef<HTMLDivElement>(null);

  useScrollToHashId(id, ref, !!data);

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  return (
    <div
      className={styles.activityContainer({ isSelected })}
      data-testid="ActivityContainer"
      key={data.id}
      ref={ref}
    >
      <div className={styles.activityRow} data-testid="ActivityRow">
        <ActivityLogo />

        <div
          className={styles.activityCommentContainer}
          data-testid="ActivityCommentContainer"
        >
          <div
            className={styles.activityEntryContent}
            data-testid="ActivityEntryContent"
          >
            <span
              className={styles.activityAuthorName}
              data-testid="ActivityAuthorName"
            >
              {user?.firstName} {user?.lastName}
            </span>{' '}
            <span style={{ fontSize: '14px' }}>
              <ActivityLinkTemplate>{data.content}</ActivityLinkTemplate>
            </span>
            <ActivityTimestamp
              id={data.id}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
