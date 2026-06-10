import { useUser } from '@clerk/tanstack-react-start';
import { useState } from 'react';
import {
  ActivityCommentContainer,
  ActivityCommentContent,
  ActivityContainer,
  AddActivityInput,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { DeleteCommentPopover } from '~/components/Activity/DeleteCommentPopover';
import { CloseAddCardButton } from '~/components/Lists/List.styled';
import type { Activity } from '~/generated/prisma/client';
import { useUpdateActivity } from '~/query/activity';
import { Flex } from '~/styles/Page.styled';
import { formatActivityTime } from '~/utils/formatDateTime';

export function ActivityComment(props: Activity) {
  const { user } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(props.content);
  const updateActivity = useUpdateActivity();
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
            <>
              <AddActivityInput
                data-testid="AddActivityInput"
                value={editedComment}
                onChange={(event) => setEditedComment(event.target.value)}
                placeholder={props.content}
                autoFocus
              />

              <Flex data-testid="Flex">
                <SaveCommentButton
                  data-testid="SaveCommentButton"
                  style={{ margin: 0 }}
                  onClick={() => {
                    updateActivity({
                      activityId: props.id,
                      cardId: props.cardId,
                      content: editedComment,
                    });
                    setIsEditing(false);
                  }}
                >
                  Save
                </SaveCommentButton>

                <CloseAddCardButton
                  data-testid="CloseAddCardButton"
                  secondary
                  style={{ margin: '0 0 0 4px' }}
                  onClick={() => setIsEditing(false)}
                >
                  X
                </CloseAddCardButton>
              </Flex>
            </>
          )}

          {!isEditing && (
            <>
              <ActivityCommentContent data-testid="ActivityCommentContent">
                {props.content}
              </ActivityCommentContent>

              <div style={{ marginLeft: '8px' }}>
                <Flex
                  data-testid="Flex"
                  style={{ alignItems: 'center', marginTop: 8 }}
                >
                  <button
                    type="button"
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        setIsEditing(true);
                      }
                    }}
                    style={{
                      border: 'none',
                      background: 'none',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </button>

                  <div
                    style={{
                      width: 4,
                      height: 4,
                      marginLeft: 4,
                      background: 'black',
                      borderRadius: '100%',
                    }}
                  />

                  <DeleteCommentPopover {...props} />
                </Flex>
              </div>
            </>
          )}
        </ActivityCommentContainer>
      </Flex>
    </ActivityContainer>
  );
}
