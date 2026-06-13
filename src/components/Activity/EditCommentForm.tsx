import { type SubmitEvent, useState } from 'react';
import {
  AddCommentInput,
  EditCommentActionsRow,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { CloseAddCardButton } from '~/components/Lists/List.styled';
import type { Activity } from '~/generated/prisma/client';
import { useUpdateActivity } from '~/query/activity';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

type EditCommentFormProps = Pick<Activity, 'id' | 'content'> & {
  setIsEditing: (isEditing: boolean) => void;
};

export function EditCommentForm({
  id,
  content,
  setIsEditing,
}: EditCommentFormProps) {
  const cardId = useCurrentCardId();
  const [editedComment, setEditedComment] = useState(content);
  const updateActivity = useUpdateActivity();

  function saveComment(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    updateActivity({
      activityId: id,
      cardId: cardId,
      content: editedComment,
    });
    setIsEditing(false);
  }

  return (
    <form onSubmit={saveComment}>
      <AddCommentInput
        name="comment"
        data-testid="AddCommentInput"
        placeholder={content}
        autoFocus
        style={{ margin: '8px 0px' }}
        value={editedComment}
        onChange={(event) => setEditedComment(event.target.value)}
      />

      <EditCommentActionsRow data-testid="EditCommentActionsRow">
        <SaveCommentButton data-testid="SaveCommentButton" type="submit">
          Save
        </SaveCommentButton>

        <CloseAddCardButton
          data-testid="CloseAddCardButton"
          type="button"
          secondary
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </CloseAddCardButton>
      </EditCommentActionsRow>
    </form>
  );
}
