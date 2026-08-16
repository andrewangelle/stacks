import { type SubmitEvent, useState } from 'react';
import {
  CommentEditorContainer,
  EditCommentActionsRow,
  SaveCommentButton,
} from '~/components/Activity/Activity.styled';
import { CloseAddCardButton } from '~/components/Lists/List.styled';
import { RichTextEditor } from '~/components/shared/RichText/RichTextEditor';
import { useUpdateActivity } from '~/db/activity/activity.query';
import type { Activity } from '~/generated/prisma/client';
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
      <CommentEditorContainer>
        <RichTextEditor
          initialValue={content}
          placeholder="Write a comment..."
          ariaLabel="Edit comment"
          testId="AddCommentInput"
          autoFocus
          minHeight="60px"
          onChange={setEditedComment}
        />
      </CommentEditorContainer>

      <EditCommentActionsRow data-testid="EditCommentActionsRow">
        <SaveCommentButton type="submit">Save</SaveCommentButton>

        <CloseAddCardButton
          type="button"
          $secondary
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </CloseAddCardButton>
      </EditCommentActionsRow>
    </form>
  );
}
