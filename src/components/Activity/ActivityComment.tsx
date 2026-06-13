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
  ActivityMeta,
  ActivityMetaTime,
  ActivityRow,
} from '~/components/Activity/Activity.styled';
import { ActivityLogo } from '~/components/Activity/ActivityLogo';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import { EditableComment } from '~/components/Activity/EditableComment';
import { useGetActivityById } from '~/query/activity';
import { formatActivityTime } from '~/utils/formatDateTime';

type ActivityLocationState = { skipActivityScroll?: boolean };

export function ActivityComment({ id }: { id: string }) {
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
      key={data?.id}
      ref={ref}
      isSelected={isSelected}
    >
      <ActivityRow data-testid="ActivityRow">
        <ActivityLogo />

        <ActivityCommentContainer data-testid="ActivityCommentContainer">
          <CommentMeta
            onClick={highlightAndCopyActivity}
            createdAt={data.createdAt}
          />
          <EditableComment id={data.id} />
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}

function CommentMeta({
  onClick,
  createdAt,
}: {
  onClick: () => void;
  createdAt: Date;
}) {
  const { user } = useUser();
  const commentTime = formatActivityTime(createdAt);

  return (
    <ActivityMeta>
      <ActivityAuthorName>
        {user?.firstName} {user?.lastName}
      </ActivityAuthorName>

      <ActivityMetaTime onClick={onClick}>{commentTime}</ActivityMetaTime>
    </ActivityMeta>
  );
}
