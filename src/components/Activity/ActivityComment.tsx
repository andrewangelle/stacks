import { useUser } from '@clerk/tanstack-react-start';
import { useState } from 'react';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityCommentContent,
  ActivityContainer,
  ActivityMeta,
  ActivityMetaTime,
  ActivityRow,
} from '~/components/Activity/Activity.styled';
import { ActivityActions } from '~/components/Activity/ActivityActions';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { EditComment } from '~/components/Activity/EditComment';
import { useGetActivityById } from '~/query/activity';
import { formatActivityTime } from '~/utils/formatDateTime';

export function ActivityComment({ id }: { id: string }) {
  const { data } = useGetActivityById({ activityId: id });
  const [isEditing, setIsEditing] = useState(false);
  if (!data) return null;
  return (
    <ActivityContainer data-testid="ActivityContainer" key={data.id}>
      <ActivityRow data-testid="ActivityRow">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <CommentInfo createdAt={data.createdAt} />

          {isEditing && (
            <EditComment
              id={data.id}
              cardId={data.cardId}
              content={data.content}
              setIsEditing={setIsEditing}
            />
          )}

          {!isEditing && (
            <>
              <ActivityCommentContent data-testid="ActivityCommentContent">
                {data.content}
              </ActivityCommentContent>

              <ActivityActions
                id={data.id}
                cardId={data.cardId}
                setIsEditing={setIsEditing}
              />
            </>
          )}
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}

function CommentInfo({ createdAt }: { createdAt: Date }) {
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
