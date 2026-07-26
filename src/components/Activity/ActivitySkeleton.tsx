import { Dialog } from 'radix-ui';
import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import * as styles from '~/components/Activity/Activity.css';
import { AddComment } from './AddComment';

export function ActivitySkeleton() {
  const [showActivity, setShowActivity] = useState(true);
  return (
    <div
      className={styles.activityPanelContainer}
      data-testid="ActivityPanelContainer"
    >
      <div className={styles.activityHeader} data-testid="ActivityHeader">
        <div
          className={styles.activityHeaderTitle}
          data-testid="ActivityHeaderTitle"
        >
          <BiCommentDetail
            size={18}
            style={{ position: 'relative', top: '4px', flexShrink: 0 }}
          />
          <Dialog.Title
            className={styles.activityTitle}
            data-testid="ActivityTitle"
          >
            Comments and activity
          </Dialog.Title>
        </div>

        <button
          type="button"
          className={styles.hideActivityButton}
          data-testid="HideActivityButton"
          onClick={() => setShowActivity((prev) => !prev)}
        >
          {showActivity ? 'Hide details' : 'Show details'}
        </button>
      </div>

      <AddComment />

      {showActivity &&
        Array.from({ length: 10 }).map(() => (
          <ActivityEntrySkeleton
            key={`activity-entry-skeleton-${Math.random()}`}
          />
        ))}

      {!showActivity && <ActivityEntrySkeleton />}
    </div>
  );
}

export function ActivityEntrySkeleton() {
  return (
    <div className={styles.activityContainer()} data-testid="ActivityContainer">
      <div className={styles.activityRow} data-testid="ActivityRow">
        <div
          className={styles.activityLogoSkeleton}
          data-testid="ActivityLogoSkeleton"
        />

        <div
          className={styles.activityCommentContainer}
          data-testid="ActivityCommentContainer"
        >
          <div
            className={styles.activityEntryContent}
            data-testid="ActivityEntryContent"
          >
            <div
              className={styles.activityContentSkeleton}
              data-testid="ActivityContentSkeleton"
            />
          </div>

          <div
            className={styles.activityTimestampMeta}
            data-testid="ActivityTimestamp"
          >
            <div
              className={styles.activityTimestampSkeleton}
              data-testid="ActivityTimestampSkeleton"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
