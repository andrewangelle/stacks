import { useState } from 'react';
import { BiCommentDetail } from 'react-icons/bi';
import {
  ActivityCommentContainer,
  ActivityContainer,
  ActivityContentSkeleton,
  ActivityEntryContent,
  ActivityHeader,
  ActivityHeaderTitle,
  ActivityLogoSkeleton,
  ActivityPanelContainer,
  ActivityRow,
  ActivityTimestampMeta,
  ActivityTimestampSkeleton,
  ActivityTitle,
  HideActivityButton,
} from '~/components/Activity/Activity.styled';
import { AddComment } from './AddComment';

export function ActivitySkeleton() {
  const [showActivity, setShowActivity] = useState(true);
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
          onClick={() => setShowActivity((prev) => !prev)}
        >
          {showActivity ? 'Hide details' : 'Show details'}
        </HideActivityButton>
      </ActivityHeader>

      <AddComment />

      {showActivity &&
        Array.from({ length: 10 }).map(() => (
          <ActivityEntrySkeleton
            key={`activity-entry-skeleton-${Math.random()}`}
          />
        ))}

      {!showActivity && <ActivityEntrySkeleton />}
    </ActivityPanelContainer>
  );
}

export function ActivityEntrySkeleton() {
  return (
    <ActivityContainer>
      <ActivityRow>
        <ActivityLogoSkeleton />

        <ActivityCommentContainer>
          <ActivityEntryContent>
            <ActivityContentSkeleton />
          </ActivityEntryContent>

          <ActivityTimestampMeta data-testid="ActivityTimestamp">
            <ActivityTimestampSkeleton />
          </ActivityTimestampMeta>
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}
