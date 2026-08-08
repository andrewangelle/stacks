import {
  EditCommentActionsRow,
  EditCommentActionsSeperator,
  EditCommentLink,
} from '~/components/Activity/Activity.styled';
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
    <EditCommentActionsRow data-testid="EditCommentActionsRow">
      <EditCommentLink onClick={() => setIsEditing(true)}>Edit</EditCommentLink>

      <EditCommentActionsSeperator />

      <DeleteCommentPopover id={id} />
    </EditCommentActionsRow>
  );
}
