import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import {
  ActivityHeader,
  ActivityHeaderTitle,
  ActivityPanelContainer,
  ActivityTitle,
  HideActivityButton,
} from '~/components/Activity/Activity.styled';
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
    <ActivityPanelContainer data-testid="ActivityPanelContainer">
      <ActivityHeader data-testid="ActivityHeader">
        <ActivityHeaderTitle data-testid="ActivityHeaderTitle">
          <BiCommentDetail
            size={18}
            style={{ position: 'relative', top: '4px', flexShrink: 0 }}
          />
          <ActivityTitle data-testid="ActivityTitle">
            Comments and activity
          </ActivityTitle>
        </ActivityHeaderTitle>

        <HideActivityButton
          data-testid="HideActivityButton"
          secondary={true}
          onClick={() => setShowActivity((prev) => !prev)}
        >
          {showActivity ? 'Hide details' : 'Show details'}
        </HideActivityButton>
      </ActivityHeader>

      <AddComment />

      <ActivityList
        showActivity={showActivity}
        selectedActivityId={selectedActivityId}
        onSelect={setSelectedActivityId}
      />
    </ActivityPanelContainer>
  );
}
