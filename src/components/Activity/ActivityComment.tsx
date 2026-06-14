import { useUser } from '@clerk/tanstack-react-start';
import { useRef, useState } from 'react';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityContainer,
  ActivityMeta,
  ActivityRow,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { ActivityTimestamp } from '~/components/Activity/ActivityTimestamp';
import { EditableComment } from '~/components/Activity/EditableComment';
import { useGetActivityById } from '~/query/activity';

export function ActivityComment({ id }: { id: string }) {
  const { isLoading, data } = useGetActivityById({ activityId: id });
  const { user } = useUser();
  const ref = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  return (
    <ActivityContainer
      data-testid="ActivityContainer"
      key={data?.id}
      ref={ref}
      isSelected={isSelected}
    >
      <ActivityRow data-testid="ActivityRow">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <ActivityMeta data-testid="ActivityMeta">
            <ActivityAuthorName data-testid="ActivityAuthorName">
              {user?.firstName} {user?.lastName}
            </ActivityAuthorName>

            <ActivityTimestamp
              id={data.id}
              isSelected={isSelected}
              setIsSelected={setIsSelected}
            />
          </ActivityMeta>

          <EditableComment id={data.id} />
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}
