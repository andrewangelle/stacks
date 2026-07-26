import { useState } from 'react';
import * as styles from '~/components/Activity/Activity.css';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useGetCardById } from '~/db/cards/cards.query';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function AddComment() {
  const cardId = useCurrentCardId();
  const { data: cardData } = useGetCardById({ id: cardId });
  const boardId = useCurrentBoardId();
  const [comment, setComment] = useState<string>('');
  const createActivity = useCreateActivity();

  function createComment() {
    createActivity({
      boardId,
      cardId,
      listId: cardData?.listId ?? '',
      type: 'comment',
      content: comment,
    });
    setComment('');
  }

  return (
    <div
      className={styles.addCommentContainer}
      data-testid="AddCommentContainer"
    >
      <div className={styles.activityRow} data-testid="ActivityRow">
        <form
          className={styles.addCommentForm}
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            className={styles.addCommentInput}
            data-testid="AddCommentInput"
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder="Write a comment..."
          />

          <div
            className={styles.editCommentActionsRow}
            data-testid="EditCommentActions"
          >
            <button
              type="submit"
              className={styles.saveCommentButton}
              data-testid="SaveCommentButton"
              onClick={createComment}
              disabled={!comment}
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
