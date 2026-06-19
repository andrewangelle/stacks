import { useLocation } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import {
  ActivityHeader,
  ActivityHeaderTitle,
  ActivityPanel,
  ActivityTitle,
  HideActivityButton,
} from '~/components/Activity/Activity.styled';
import { ActivityComment } from '~/components/Activity/ActivityComment';
import { ActivityEntry } from '~/components/Activity/ActivityEntry';
import { AddComment } from '~/components/Activity/AddComment';
import { useGetActivity, useGetComments } from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CardActivity() {
  const cardId = useCurrentCardId();
  const location = useLocation();
  const [showActivity, setShowActivity] = useState(true);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
    null,
  );
  const { data } = useGetActivity({ cardId });
  const { data: comments } = useGetComments({ cardId });

  useEffect(() => {
    const [, activityId = ''] = location.hash?.split('activity-') ?? [];

    if (activityId) {
      setSelectedActivityId(activityId);
    }
  }, [location.hash]);

  return (
    <ActivityPanel data-testid="ActivityPanel">
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

      {!showActivity &&
        comments?.map((comment) => (
          <ActivityComment
            key={comment.id}
            id={comment.id}
            isSelected={selectedActivityId === comment.id}
            onSelect={() => setSelectedActivityId(comment.id)}
          />
        ))}

      {showActivity &&
        data?.map((entry) =>
          entry?.type === 'feed' ? (
            <ActivityEntry
              key={entry.id}
              id={entry.id}
              isSelected={selectedActivityId === entry.id}
              onSelect={() => setSelectedActivityId(entry.id)}
            />
          ) : (
            <ActivityComment
              key={entry.id}
              id={entry.id}
              isSelected={selectedActivityId === entry.id}
              onSelect={() => setSelectedActivityId(entry.id)}
            />
          ),
        )}
    </ActivityPanel>
  );
}
