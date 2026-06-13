import { useState } from 'react';
import {
  AddCommentInput,
  EditCommentActionsRow,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { CloseAddCardButton } from '~/components/Lists/List.styled';
import type { Activity } from '~/generated/prisma/client';
import { useUpdateActivity } from '~/query/activity';

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
        placeholder={props.content}
        autoFocus
        style={{ margin: '8px 0px' }}
        value={editedComment}
        onChange={(event) => setEditedComment(event.target.value)}
      />

      <EditCommentActionsRow data-testid="EditCommentActionsRow">
        <SaveCommentButton
          data-testid="SaveCommentButton"
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
          onClick={() => props.setIsEditing(false)}
        >
          Cancel
        </CloseAddCardButton>
      </EditCommentActionsRow>
    </>
  );
}
