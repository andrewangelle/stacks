import { useUser } from '@clerk/tanstack-react-start';
import { useRef } from 'react';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityContainer,
  ActivityEntryContent,
  ActivityRow,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { ActivityTimestamp } from '~/components/Activity/ActivityTimestamp';
import { useScrollToActivityHash } from '~/components/Activity/useScrollToActivityHash';
import { useGetActivityById } from '~/query/activity';

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
  const { user } = useUser();
  const { isLoading, data } = useGetActivityById({ activityId: id });
  const ref = useRef<HTMLDivElement>(null);

  useScrollToActivityHash(id, ref, !!data);

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
            {data.content}
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
