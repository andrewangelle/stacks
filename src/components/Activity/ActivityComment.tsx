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
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const commentTime = formatActivityTime(props.createdAt);
  return (
    <ActivityContainer data-testid="ActivityContainer" key={props.id}>
      <Flex data-testid="Flex">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <div style={{ marginLeft: '8px' }}>
            <strong>
              {user?.firstName} {user?.lastName}
            </strong>
            <span style={{ marginLeft: '4px' }}>{commentTime}</span>
          </div>

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
