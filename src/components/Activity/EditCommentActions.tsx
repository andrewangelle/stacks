import * as styles from '~/components/Activity/Activity.css';
import { DeleteCommentPopover } from '~/components/Activity/DeleteCommentPopover';
import type { Activity } from '~/generated/prisma/client';

type EditCommentActionsProps = Pick<Activity, 'id'> & {
  setIsEditing: (isEditing: boolean) => void;
};

export function EditCommentActions({
  id,
  setIsEditing,
}: EditCommentActionsProps) {
  return (
    <div
      className={styles.editCommentActionsRow}
      data-testid="EditCommentActionsRow"
    >
      <button
        type="button"
        className={styles.editCommentLink}
        data-testid="EditCommentLink"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </button>

      <div
        className={styles.editCommentActionsSeperator}
        data-testid="ActivityActionsSeparator"
      />

      <DeleteCommentPopover id={id} />
    </div>
  );
}
