import {
  EditCommentActionsRow,
  EditCommentActionsSeperator,
  EditCommentLink,
} from '~/components/Activity/Activity.styled';
import { DeleteCommentPopover } from '~/components/Activity/DeleteCommentPopover';
import type { Activity } from '~/generated/prisma/client';

type EditCommentActionsProps = Pick<Activity, 'id' | 'cardId'> & {
  setIsEditing: (isEditing: boolean) => void;
};

export function EditCommentActions({
  id,
  cardId,
  setIsEditing,
}: EditCommentActionsProps) {
  return (
    <EditCommentActionsRow data-testid="EditCommentActionsRow">
      <EditCommentLink
        data-testid="EditCommentLink"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </EditCommentLink>

      <EditCommentActionsSeperator data-testid="ActivityActionsSeparator" />

      <DeleteCommentPopover id={id} cardId={cardId} />
    </EditCommentActionsRow>
  );
}
