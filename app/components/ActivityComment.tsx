import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { formatRelative } from 'date-fns'

import { ActivityLogo, DeleteCommentPopover } from '~/components';
import { ActivityContainer, Flex, ActivityCommentContainer, ActivityCommentContent, AddActivityInput, SaveCommentButton, CloseAddCardButton } from "~/styles";

import { ActivityType, tokenState, useGetProfileQuery, useUpdateActivityMutation } from "~/store";

export function ActivityComment(props: ActivityType){
  const [token] = useRecoilState(tokenState);
  const profile = useGetProfileQuery(
    {userId: token?.user.id!},
    {skip: !token?.user.id}
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(props.content);
  const [updateActivity] = useUpdateActivityMutation();
  const commentTime = formatRelative(new Date(props.created_at), new Date(props.created_at));
  return (
    <ActivityContainer key={props.id}>
      <Flex>
        <ActivityLogo />

        <ActivityCommentContainer>
          <div style={{marginLeft: '8px'}}>
            <strong>{profile.data?.firstName}{' '}{profile.data?.lastName}</strong>
            <span style={{marginLeft: '4px'}}>{commentTime}</span>
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
                  style={{margin: 0}}
                  onClick={() => {
                    updateActivity({
                      id: props.id,
                      cardId: props.cardId,
                      content: editedComment,
                      token: token?.access_token!
                    })
                    setIsEditing(false)
                  }}
                >
                  Save
                </SaveCommentButton>

                <CloseAddCardButton 
                  secondary 
                  style={{margin: '0 0 0 4px'}} 
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

              <div style={{marginLeft: '8px'}}>
                <Flex>
                  <div 
                    style={{
                      textDecoration: 'underline',
                      cursor: 'pointer'
                    }}
                    onClick={() => setIsEditing(true)}
                  >
                    Edit
                  </div> 
                  <DeleteCommentPopover {...props} />
                </Flex>
              </div>
            </>
          )}
        </ActivityCommentContainer>
      </Flex>
    </ActivityContainer>
  )
}