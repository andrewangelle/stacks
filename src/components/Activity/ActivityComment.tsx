import { useUser } from '@clerk/tanstack-react-start';
import { useRef } from 'react';
import * as styles from '~/components/Activity/Activity.css';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { ActivityTimestamp } from '~/components/Activity/ActivityTimestamp';
import { EditableComment } from '~/components/Activity/EditableComment';
import { useGetActivityById } from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { useScrollToHashId } from '~/utils/useScrollToHashId';

type ActivityCommentProps = {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function ActivityComment({
  id,
  isSelected,
  onSelect,
}: ActivityCommentProps) {
  const cardId = useCurrentCardId();
  const { isLoading, data } = useGetActivityById({ activityId: id, cardId });
  const { user } = useUser();
  const ref = useRef<HTMLDivElement>(null);

  useScrollToHashId(id, ref, !!data);

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  return (
    <div
      className={styles.activityContainer({ isSelected })}
      data-testid="ActivityContainer"
      key={data?.id}
      ref={ref}
    >
      <div className={styles.activityRow} data-testid="ActivityRow">
        <ActivityLogo />

        <div
          className={styles.activityCommentContainer}
          data-testid="ActivityCommentContainer"
        >
          <div className={styles.activityMeta} data-testid="ActivityMeta">
            <span
              className={styles.activityAuthorName}
              data-testid="ActivityAuthorName"
            >
              {user?.firstName} {user?.lastName}
            </span>

            <ActivityTimestamp
              className={styles.commentTimestamp}
              testId="CommentTimestamp"
              id={data.id}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          </div>

          <EditableComment id={data.id} />
        </div>
      </div>
    </div>
  );
}
