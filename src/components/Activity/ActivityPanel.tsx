import { useLocation } from '@tanstack/react-router';
import { Dialog } from 'radix-ui';
import { useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import * as styles from '~/components/Activity/Activity.css';
import { ActivityList } from '~/components/Activity/ActivityList';
import { AddComment } from '~/components/Activity/AddComment';

export function ActivityPanel() {
  const location = useLocation();
  const [showActivity, setShowActivity] = useState(true);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );

  useEffect(() => {
    const [, activityId = ''] = location.hash?.split('activity-') ?? [];

    if (activityId) {
      setSelectedActivityId(activityId);
    }
  }, [location.hash]);

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

      <ActivityList
        showActivity={showActivity}
        selectedActivityId={selectedActivityId}
        onSelect={setSelectedActivityId}
      />
    </div>
  );
}
