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

      <ActivityListSkeleton showActivity={showActivity} />
    </ActivityPanelContainer>
  );
}

const SKELETON_ROW_KEYS = Array.from(
  { length: 10 },
  (_, index) => `activity-entry-skeleton-${index}`,
);

/**
 * The fallback for the list's own boundary, so entries can load without
 * taking the panel — and the comment being written in it — down with them.
 */
export function ActivityListSkeleton({
  showActivity,
}: {
  showActivity: boolean;
}) {
  const keys = showActivity ? SKELETON_ROW_KEYS : SKELETON_ROW_KEYS.slice(0, 1);

  return (
    <>
      {keys.map((key) => (
        <ActivityEntrySkeleton key={key} />
      ))}
    </>
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
