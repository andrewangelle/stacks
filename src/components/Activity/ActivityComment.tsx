import { useUser } from '@clerk/tanstack-react-start';
import { useState } from 'react';
import {
  ActivityCommentContainer,
  ActivityCommentContent,
  ActivityContainer,
} from '~/components/Activity/Activity.styled';
import { ActivityActions } from '~/components/Activity/ActivityActions';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { EditComment } from '~/components/Activity/EditComment';
import type { Activity } from '~/generated/prisma/client';
import { Flex } from '~/styles/Page.styled';
import { formatActivityTime } from '~/utils/formatDateTime';

export function ActivityComment(props: Activity) {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <ActivityContainer data-testid="ActivityContainer" key={props.id}>
      <Flex data-testid="Flex">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <CommentInfo createdAt={props.createdAt} />

          {isEditing && (
            <EditComment
              id={props.id}
              cardId={props.cardId}
              content={props.content}
              setIsEditing={setIsEditing}
            />
          )}

          {!isEditing && (
            <>
              <ActivityCommentContent data-testid="ActivityCommentContent">
                {props.content}
              </ActivityCommentContent>

              <ActivityActions
                id={props.id}
                cardId={props.cardId}
                setIsEditing={setIsEditing}
              />
            </>
          )}
        </ActivityCommentContainer>
      </Flex>
    </ActivityContainer>
  );
}

function CommentInfo({ createdAt }: { createdAt: Date }) {
  const { user } = useUser();
  const commentTime = formatActivityTime(createdAt);

  return (
    <div style={{ marginLeft: '8px' }}>
      <span style={{ fontWeight: 600 }}>
        {user?.firstName} {user?.lastName}
      </span>
      <span style={{ marginLeft: '4px' }}>{commentTime}</span>
    </div>
  );
}
