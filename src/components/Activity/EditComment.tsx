import { useState } from 'react';
import {
  AddCommentInput,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { CloseAddCardButton } from '~/components/Lists/List.styled';
import type { Activity } from '~/generated/prisma/client';
import { useUpdateActivity } from '~/query/activity';
import { Flex } from '~/styles/Page.styled';

export function EditComment(
  props: Pick<Activity, 'id' | 'cardId' | 'content'> & {
    setIsEditing: (isEditing: boolean) => void;
  },
) {
  const [editedComment, setEditedComment] = useState(props.content);
  const updateActivity = useUpdateActivity();
  return (
    <>
      <AddCommentInput
        data-testid="AddCommentInput"
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
            props.setIsEditing(false);
          }}
        >
          Save
        </SaveCommentButton>

        <CloseAddCardButton
          data-testid="CloseAddCardButton"
          secondary
          style={{ margin: '0 0 0 4px' }}
          onClick={() => props.setIsEditing(false)}
        >
          Cancel
        </CloseAddCardButton>
      </Flex>
    </>
  );
}
