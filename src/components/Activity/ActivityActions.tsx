import {
  ActivityActionsSeparator,
  EditCommentLink,
} from '~/components/Activity/Activity.styled';
import { DeleteCommentPopover } from '~/components/Activity/DeleteCommentPopover';
import type { Activity } from '~/generated/prisma/client';
import { Flex } from '~/styles/Page.styled';

export function ActivityActions({
  id,
  cardId,
  setIsEditing,
}: Pick<Activity, 'id' | 'cardId'> & {
  setIsEditing: (isEditing: boolean) => void;
}) {
  return (
    <div style={{ marginLeft: '8px' }}>
      <Flex data-testid="Flex" style={{ alignItems: 'center', marginTop: 8 }}>
        <EditCommentLink
          data-testid="EditCommentLink"
          onClick={() => setIsEditing(true)}
        >
          Edit
        </EditCommentLink>

        <ActivityActionsSeparator data-testid="ActivityActionsSeparator" />

        <DeleteCommentPopover id={id} cardId={cardId} />
      </Flex>
    </div>
  );
}
