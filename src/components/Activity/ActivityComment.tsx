import { useUser } from '@clerk/tanstack-react-start';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityContainer,
  ActivityMeta,
  ActivityMetaTime,
  ActivityRow,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { EditableComment } from '~/components/Activity/EditableComment';
import { useGetActivityById } from '~/query/activity';
import { formatActivityTime } from '~/utils/formatDateTime';

export function ActivityComment({ id }: { id: string }) {
  const { isLoading, data } = useGetActivityById({ activityId: id });

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  return (
    <ActivityContainer data-testid="ActivityContainer" key={data?.id}>
      <ActivityRow data-testid="ActivityRow">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <CommentMeta createdAt={data.createdAt} />
          <EditableComment id={data.id} />
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}

function CommentMeta({ createdAt }: { createdAt: Date }) {
  const { user } = useUser();
  const commentTime = formatActivityTime(createdAt);

  return (
    <ActivityMeta>
      <ActivityAuthorName>
        {user?.firstName} {user?.lastName}
      </ActivityAuthorName>
      <ActivityMetaTime>{commentTime}</ActivityMetaTime>
    </ActivityMeta>
  );
}
