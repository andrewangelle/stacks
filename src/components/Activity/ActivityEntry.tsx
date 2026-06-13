import { useUser } from '@clerk/tanstack-react-start';
import {
  type HistoryState,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
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

type ActivityLocationState = { skipActivityScroll?: boolean };

export function ActivityEntry({ id }: { id: string }) {
  const { user } = useUser();
  const { isLoading, isSuccess, data } = useGetActivityById({ activityId: id });
  const navigate = useNavigate();
  const location = useLocation();
  const { cardId } = useParams({ strict: false });
  const ref = useRef<HTMLDivElement>(null);
  const [isSelected, setIsSelected] = useState(false);

  function highlightAndCopyActivity() {
    const nextLocation = `${window.location.origin}/card/${cardId?.slice(0, 8)}#activity-${id}`;

    navigate({
      href: `/card/${cardId?.slice(0, 8)}#activity-${id}`,
      replace: true,
      resetScroll: false,
      hashScrollIntoView: false,
      // Carries across the route remount so the in-app click highlights
      // without scrolling; a direct visit has no state and still scrolls.
      state: (prev) => ({ ...prev, skipActivityScroll: true }) as HistoryState,
    });

    navigator.clipboard.writeText(nextLocation);
  }

  useEffect(() => {
    const [, activityId = ''] = location.hash?.split('activity-') ?? [];
    const isMatch = activityId === id;
    setIsSelected(isMatch);

    const skipScroll = (location.state as ActivityLocationState)
      .skipActivityScroll;

    if (!isMatch || skipScroll || !isSuccess || !data) {
      return;
    }

    const timeoutId = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 350);

    return () => clearTimeout(timeoutId);
  }, [location.hash, location.state, id, isSuccess, data]);

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
