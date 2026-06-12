import {
  ActivityActionsRow,
  ActivityActionsSeparator,
  EditCommentLink,
} from '~/components/Activity/Activity.styled';
import { DeleteCommentPopover } from '~/components/Activity/DeleteCommentPopover';
import type { Activity } from '~/generated/prisma/client';

export function ActivityActions({
  id,
  cardId,
  setIsEditing,
}: Pick<Activity, 'id' | 'cardId'> & {
  setIsEditing: (isEditing: boolean) => void;
}) {
  return (
    <ActivityActionsRow data-testid="Flex">
      <EditCommentLink
        data-testid="EditCommentLink"
        onClick={() => setIsEditing(true)}
      >
        Edit
      </EditCommentLink>

      <ActivityActionsSeparator data-testid="ActivityActionsSeparator" />

      <DeleteCommentPopover id={id} cardId={cardId} />
    </ActivityActionsRow>
  );
}
