import { formatRelative } from 'date-fns';
import { useAtom } from 'jotai';
import { useState } from 'react';

import { ActivityLogo } from '~/components/ActivityLogo';
import { DeleteCommentPopover } from '~/components/DeleteCommentPopover';
import {
  type ActivityType,
  useUpdateActivityMutation,
} from '~/store/activityApi';
import { tokenState } from '~/store/atoms';
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
  const [token] = useAtom(tokenState);
  const profile = useGetProfileQuery(
    { userId: token?.user.id ?? '' },
    { skip: !token?.user.id },
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(props.content);
  const [updateActivity] = useUpdateActivityMutation();
  const commentTime = formatRelative(
    new Date(props.created_at),
    new Date(props.created_at),
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
                      token: token?.access_token ?? '',
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
