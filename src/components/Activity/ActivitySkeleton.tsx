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

function ActivityEntrySkeleton() {
  return (
    <ActivityContainer data-testid="ActivityContainer">
      <ActivityRow data-testid="ActivityRow">
        <ActivityLogoSkeleton data-testid="ActivityLogoSkeleton" />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <ActivityEntryContent data-testid="ActivityEntryContent">
            <ActivityContentSkeleton data-testid="ActivityContentSkeleton" />
          </ActivityEntryContent>

          <ActivityTimestampMeta data-testid="ActivityTimestamp">
            <ActivityTimestampSkeleton data-testid="ActivityTimestampSkeleton" />
          </ActivityTimestampMeta>
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}
