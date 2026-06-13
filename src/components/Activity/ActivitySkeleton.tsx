import {
  ActivityCommentContainer,
  ActivityContainer,
  ActivityContentSkeleton,
  ActivityEntryContent,
  ActivityLogoSkeleton,
  ActivityRow,
  ActivityTimestamp,
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

          <ActivityTimestamp data-testid="ActivityTimestamp">
            <ActivityTimestampSkeleton data-testid="ActivityTimestampSkeleton" />
          </ActivityTimestamp>
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}
