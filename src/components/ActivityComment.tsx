import { formatRelative } from 'date-fns';
import { useState } from 'react';
import { useSessionUserId } from '~/auth/useSessionUserId';
import { ActivityLogo } from '~/components/ActivityLogo';
import { DeleteCommentPopover } from '~/components/DeleteCommentPopover';
import {
  type ActivityType,
  useUpdateActivityMutation,
} from '~/store/activityApi';
import { useGetProfileQuery } from '~/store/profileApi';
import {
  ActivityCommentContainer,
  ActivityCommentContent,
  ActivityContainer,
  AddActivityInput,
  SaveCommentButton,
} from '~/styles/Activity';
import { CloseAddCardButton } from '~/styles/List';
import { Flex } from '~/styles/Page';

export function ActivityComment(props: ActivityType) {
  const userId = useSessionUserId();
  const profile = useGetProfileQuery(
    { userId: userId ?? '' },
    { skip: !userId },
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(props.content);
  const [updateActivity] = useUpdateActivityMutation();
  const commentTime = formatRelative(
    new Date(props.createdAt),
    new Date(props.createdAt),
  );
  return (
    <ActivityContainer key={props.id}>
      <Flex>
        <ActivityLogo />

        <ActivityCommentContainer>
          <div style={{ marginLeft: '8px' }}>
            <strong>
              {profile.data?.firstName} {profile.data?.lastName}
            </strong>
            <span style={{ marginLeft: '4px' }}>{commentTime}</span>
          </div>

          {isEditing && (
            <>
              <AddActivityInput
                value={editedComment}
                onChange={(event) => setEditedComment(event.target.value)}
                placeholder={props.content}
              />

              <Flex>
                <SaveCommentButton
                  style={{ margin: 0 }}
                  onClick={() => {
                    updateActivity({
                      id: props.id,
                      cardId: props.cardId,
                      content: editedComment,
                    });
                    setIsEditing(false);
                  }}
                >
                  Save
                </SaveCommentButton>

                <CloseAddCardButton
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
              <ActivityCommentContent>{props.content}</ActivityCommentContent>

              <div style={{ marginLeft: '8px' }}>
                <Flex>
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
