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
import { useGetActivity, useGetComments } from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function ActivityPanel() {
  const cardId = useCurrentCardId();
  const location = useLocation();
  const [showActivity, setShowActivity] = useState(true);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useGetActivity({ cardId });
  const { data: comments } = useGetComments({ cardId });

  // Both views page through the same cursor, so whichever one is on screen is
  // what keeps pulling entries in.
  const entries = showActivity ? data : (comments ?? []);

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
        entries={entries}
        selectedActivityId={selectedActivityId}
        onSelect={setSelectedActivityId}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </ActivityPanelContainer>
  );
}
