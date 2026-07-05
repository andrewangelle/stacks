import { useUser } from '@clerk/tanstack-react-start';
import { useRef } from 'react';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityContainer,
  ActivityEntryContent,
  ActivityRow,
} from '~/components/Activity/Activity.styled';
import { ActivityLinkTemplate } from '~/components/Activity/ActivityLinkTemplate';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { ActivityTimestamp } from '~/components/Activity/ActivityTimestamp';
import { useGetActivityById } from '~/db/activity/activity.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { useScrollToHashId } from '~/utils/useScrollToHashId';

type ActivityEntryProps = {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function ActivityEntry({
  id,
  isSelected,
  onSelect,
}: ActivityEntryProps) {
  const cardId = useCurrentCardId();
  const { user } = useUser();
  const { isLoading, data } = useGetActivityById({ activityId: id, cardId });
  const ref = useRef<HTMLDivElement>(null);

  useScrollToHashId(id, ref, !!data);

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  return (
    <ActivityContainer
      data-testid="ActivityContainer"
      key={data.id}
      isSelected={isSelected}
      ref={ref}
    >
      <ActivityRow data-testid="ActivityRow">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <ActivityEntryContent data-testid="ActivityEntryContent">
            <ActivityAuthorName data-testid="ActivityAuthorName">
              {user?.firstName} {user?.lastName}
            </ActivityAuthorName>{' '}
            <span style={{ fontSize: '14px' }}>
              <ActivityLinkTemplate>{data.content}</ActivityLinkTemplate>
            </span>
            <ActivityTimestamp
              id={data.id}
              isSelected={isSelected}
              onSelect={onSelect}
            />
          </ActivityEntryContent>
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}
