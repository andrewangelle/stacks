import { formatRelative } from 'date-fns';
import { useState } from 'react';
import {
  ActivityCommentContainer,
  ActivityCommentContent,
  ActivityContainer,
  AddActivityInput,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { DeleteCommentPopover } from '~/components/Cards/DeleteCommentPopover';
import { CloseAddCardButton } from '~/components/Lists/List.styled';
import { type ActivityType, useUpdateActivityMutation } from '~/query/activity';
import { useGetProfileQuery } from '~/query/profile';
import { Flex } from '~/styles/Page.styled';

export function ActivityComment(props: ActivityType) {
  const profile = useGetProfileQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(props.content);
  const [updateActivity] = useUpdateActivityMutation();
  const commentTime = formatRelative(
    new Date(props.createdAt),
    new Date(props.createdAt),
  );
  return (
    <ActivityContainer data-testid="ActivityContainer" key={props.id}>
      <Flex data-testid="Flex">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <div style={{ marginLeft: '8px' }}>
            <strong>
              {profile.data?.firstName} {profile.data?.lastName}
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
              />

              <Flex data-testid="Flex">
                <SaveCommentButton
                  data-testid="SaveCommentButton"
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
                <Flex data-testid="Flex">
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
