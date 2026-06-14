import {
  type HistoryState,
  useLocation,
  useNavigate,
  useParams,
} from '@tanstack/react-router';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { GoPaperclip } from 'react-icons/go';
import {
  ActivityCopiedCheckmark,
  ActivityTimestampMeta,
  PaperclipReveal,
} from '~/components/Activity/Activity.styled';
import { useGetActivityById } from '~/query/activity';
import { formatActivityTime } from '~/utils/formatDateTime';
import { ActivitySkeleton } from './ActivitySkeleton';

type ActivityLocationState = { skipActivityScroll?: boolean };

type ActivityTimestampProps = {
  id: string;
  isSelected: boolean;
  setIsSelected: Dispatch<SetStateAction<boolean>>;
};

export function ActivityTimestamp({
  id,
  isSelected,
  setIsSelected,
}: ActivityTimestampProps) {
  const { isLoading, isSuccess, data } = useGetActivityById({ activityId: id });
  const navigate = useNavigate();
  const location = useLocation();
  const { cardId } = useParams({ strict: false });
  const ref = useRef<HTMLDivElement>(null);
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

    const timer = setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    }, 350);

    return () => clearTimeout(timer);
  }, [location.hash, location.state, id, isSuccess, data, setIsSelected]);

  const clearCopiedCheckmark = useCallback(() => {
    let timer: NodeJS.Timeout | undefined;

    if (showCheckmark) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [showCheckmark]);

  useEffect(autoScrollToActivity, [autoScrollToActivity]);
  useEffect(clearCopiedCheckmark, [clearCopiedCheckmark]);

  if (isLoading || !data) {
    return <ActivitySkeleton />;
  }

  return (
    <ActivityTimestampMeta
      data-testid="ActivityTimestamp"
      onClick={highlightAndCopyActivity}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {formatActivityTime(data?.createdAt)}

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
    </ActivityTimestampMeta>
  );
}
