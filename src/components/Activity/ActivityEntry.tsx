import { useUser } from '@clerk/tanstack-react-start';
import { useLocation, useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityContainer,
  ActivityEntryContent,
  ActivityRow,
  ActivityTimestamp,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { useGetActivityById } from '~/query/activity';
import { formatActivityTime } from '~/utils/formatDateTime';
import { ActivitySkeleton } from './ActivitySkeleton';

export function ActivityEntry({ id }: { id: string }) {
  const { user } = useUser();
  const { isLoading, isSuccess, data } = useGetActivityById({ activityId: id });
  const navigate = useNavigate();
  const location = useLocation();
  const { cardId } = useParams({ strict: false });
  const ref = useRef<HTMLDivElement>(null);
  const skipScrollRef = useRef(false);
  const [isSelected, setIsSelected] = useState(false);

  function highlightAndCopyActivity() {
    const nextLocation = `${window.location.origin}/card/${cardId?.slice(0, 8)}#activity-${id}`;

    skipScrollRef.current = true;
    navigate({
      href: nextLocation,
      resetScroll: false,
      hashScrollIntoView: false,
    });

    navigator.clipboard.writeText(nextLocation);
    setIsSelected(true);
  }

  useEffect(() => {
    const [, activityId = ''] = location.hash?.split('activity-') ?? [];
    const isMatch = activityId === id;
    setIsSelected(isMatch);

    if (!isMatch || skipScrollRef.current || !isSuccess || !data) {
      skipScrollRef.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 350);

    skipScrollRef.current = false;

    return () => clearTimeout(timeoutId);
  }, [location.hash, id, isSuccess, data]);

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
          <ActivityEntryContent>
            <ActivityAuthorName>
              {user?.firstName} {user?.lastName}
            </ActivityAuthorName>{' '}
            {data.content}
          </ActivityEntryContent>

          <ActivityTimestamp onClick={highlightAndCopyActivity}>
            {formatActivityTime(data?.createdAt)}
          </ActivityTimestamp>
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}
