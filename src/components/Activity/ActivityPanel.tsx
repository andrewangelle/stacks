import { useLocation } from '@tanstack/react-router';
import { Suspense, useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import {
  ActivityHeader,
  ActivityHeaderTitle,
  ActivityPanelContainer,
  ActivityTitle,
  HideActivityButton,
} from '~/components/Activity/Activity.styled';
import { ActivityList } from '~/components/Activity/ActivityList';
import { ActivityListSkeleton } from '~/components/Activity/ActivitySkeleton';
import { AddComment } from '~/components/Activity/AddComment';
import {
  useGetShowActivityDetails,
  useSetShowActivityDetails,
} from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function ActivityPanel() {
  const location = useLocation();
  const cardId = useCurrentCardId();
  const { data: showActivity } = useGetShowActivityDetails({ cardId });
  const setShowActivityDetails = useSetShowActivityDetails();
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
    <ActivityPanelContainer>
      <ActivityHeader>
        <ActivityHeaderTitle>
          <BiCommentDetail
            size={18}
            style={{ position: 'relative', top: '4px', flexShrink: 0 }}
          />
          <ActivityTitle>Comments and activity</ActivityTitle>
        </ActivityHeaderTitle>

        <HideActivityButton
          $secondary={true}
          onClick={() =>
            setShowActivityDetails({
              cardId,
              showActivityDetails: !showActivity,
            })
          }
        >
          {showActivity ? 'Hide details' : 'Show details'}
        </HideActivityButton>
      </ActivityHeader>

      <AddComment />

      {/*
       * The entries load on their own boundary. Under the panel's boundary
       * alone, `useGetActivity` resolving a beat after the panel committed
       * re-suspended the whole panel: React tore down the committed subtree
       * and rebuilt it, silently emptying a comment already being written.
       */}
      <Suspense fallback={<ActivityListSkeleton showActivity={showActivity} />}>
        <ActivityList
          showActivity={showActivity}
          selectedActivityId={selectedActivityId}
          onSelect={setSelectedActivityId}
        />
      </Suspense>
    </ActivityPanelContainer>
  );
}
