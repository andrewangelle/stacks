import {
  ActivityCommentContainer,
  ActivityContainer,
  ActivityContentSkeleton,
  ActivityEntryContent,
  ActivityLogoSkeleton,
  ActivityRow,
  ActivityTimestampMeta,
  ActivityTimestampSkeleton,
} from '~/components/Activity/Activity.styled';

export function ActivitySkeleton() {
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
