import { useUser } from '@clerk/tanstack-react-start';
import { useRef } from 'react';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityContainer,
  ActivityMeta,
  ActivityRow,
  CommentTimestamp,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { EditableComment } from '~/components/Activity/EditableComment';
import { useGetActivityById } from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { useScrollToHashId } from '~/utils/useScrollToHashId';

type ActivityCommentProps = {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function ActivityComment({
  id,
  isSelected,
  onSelect,
}: ActivityCommentProps) {
  const cardId = useCurrentCardId();
  const { isLoading, data } = useGetActivityById({ activityId: id, cardId });
  const { user } = useUser();
  const ref = useRef<HTMLDivElement>(null);

  useScrollToHashId(id, ref, !!data);

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  return (
    <ActivityContainer key={data?.id} ref={ref} $isSelected={isSelected}>
      <ActivityRow>
        <ActivityLogo />

        <ActivityCommentContainer>
          <ActivityMeta>
            <ActivityAuthorName>
              {user?.firstName} {user?.lastName}
            </ActivityAuthorName>

            <CommentTimestamp
              testId="CommentTimestamp"
              id={data.id}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          </ActivityMeta>

          <EditableComment id={data.id} />
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}
