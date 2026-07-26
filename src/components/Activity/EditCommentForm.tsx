import { type SubmitEvent, useState } from 'react';
import * as activityStyles from '~/components/Activity/Activity.css';
import * as listStyles from '~/components/Lists/List.css';
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
      <input
        className={activityStyles.addCommentInput}
        name="comment"
        data-testid="AddCommentInput"
        placeholder={content}
        style={{ margin: '8px 0px' }}
        value={editedComment}
        onChange={(event) => setEditedComment(event.target.value)}
      />

      <div
        className={activityStyles.editCommentActionsRow}
        data-testid="EditCommentActionsRow"
      >
        <button
          className={activityStyles.saveCommentButton}
          data-testid="SaveCommentButton"
          type="submit"
        >
          Save
        </button>

        <button
          className={listStyles.closeAddCardButton}
          data-testid="CloseAddCardButton"
          type="button"
          onClick={() => setIsEditing(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
