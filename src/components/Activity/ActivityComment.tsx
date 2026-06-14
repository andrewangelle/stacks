import { useUser } from '@clerk/tanstack-react-start';
import {
  type HistoryState,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { GoPaperclip } from 'react-icons/go';
import {
  ActivityAuthorName,
  ActivityCommentContainer,
  ActivityContainer,
  ActivityCopiedCheckmark,
  ActivityMeta,
  ActivityMetaTime,
  ActivityRow,
  PaperclipReveal,
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
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wasCopied, setWasCopied] = useState(false);

  const showCheckmark = isSelected && isCopied;
  const showPaperclipIcon = !showCheckmark && (isHovered || wasCopied);

  function highlightAndCopyActivity() {
    setIsCopied(true);
    setWasCopied(true);
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

  const autoScrollToActivity = useCallback(() => {
    const [, activityId = ''] = location.hash?.split('activity-') ?? [];
    const isMatch = activityId === id;
    setIsSelected(isMatch);

    if (!isMatch) {
      setWasCopied(false);
    }

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

  const clearCopiedCheckmark = useCallback(() => {
    let timeoutId: NodeJS.Timeout | undefined;

    if (showCheckmark) {
      timeoutId = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }

    return () => clearTimeout(timeoutId);
  }, [showCheckmark]);

  useEffect(autoScrollToActivity, [autoScrollToActivity]);
  useEffect(clearCopiedCheckmark, [clearCopiedCheckmark]);

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
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            createdAt={data.createdAt}
            showPaperclipIcon={showPaperclipIcon}
            showCheckmark={showCheckmark}
          />
          <EditableComment id={data.id} />
        </ActivityCommentContainer>
      </ActivityRow>
    </ActivityContainer>
  );
}

type CommentMetaProps = {
  createdAt: Date;
  showPaperclipIcon: boolean;
  showCheckmark: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

function CommentMeta({
  onClick,
  onMouseEnter,
  onMouseLeave,
  createdAt,
  showPaperclipIcon,
  showCheckmark,
}: CommentMetaProps) {
  const { user } = useUser();
  const commentTime = formatActivityTime(createdAt);

  return (
    <ActivityMeta>
      <ActivityAuthorName>
        {user?.firstName} {user?.lastName}
      </ActivityAuthorName>

      <ActivityMetaTime
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        {commentTime}

        <PaperclipReveal
          isVisible={showPaperclipIcon}
          aria-hidden={!showPaperclipIcon}
        >
          <GoPaperclip
            size={12}
            data-testid="GoPaperclip"
            style={{ marginLeft: '4px', color: 'black' }}
          />
        </PaperclipReveal>

        {showCheckmark && (
          <ActivityCopiedCheckmark data-testid="ActivityCopiedCheckmark">
            <AiOutlineCheck
              size={8}
              data-testid="CardCompletedIndicatorCheckmark"
              style={{
                top: '1px',
                position: 'relative',
                left: '1px',
              }}
            />
          </ActivityCopiedCheckmark>
        )}
      </ActivityMetaTime>
    </ActivityMeta>
  );
}
