import { useParams } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
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

type ActivityTimestampProps = {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
};

export function ActivityTimestamp({
  id,
  isSelected,
  onSelect,
}: ActivityTimestampProps) {
  const { isLoading, data } = useGetActivityById({ activityId: id });
  const { cardId } = useParams({ strict: false });
  const [isCopied, setIsCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wasCopied, setWasCopied] = useState(false);

  const showCheckmark = isSelected && isCopied;
  const showPaperclipIcon = !showCheckmark && (isHovered || wasCopied);

  function highlightAndCopyActivity() {
    setIsCopied(true);
    setWasCopied(true);
    onSelect();

    // Copy the canonical shareable permalink. We intentionally do NOT navigate
    // or touch window.history here: the card view is rendered behind a route
    // mask, so any router/history update re-parses the masked URL, remounts the
    // activity subtree, and resets the selected/copied state — hiding the
    // checkmark and highlight. Deep-linking still works when the copied link is
    // opened directly (the hash is read on load to select and scroll).
    const shareableLink = `${window.location.origin}/card/${cardId?.slice(0, 8)}#activity-${id}`;

    navigator.clipboard.writeText(shareableLink);
  }

  const clearCopiedCheckmark = useCallback(() => {
    let timer: NodeJS.Timeout | undefined;

    if (showCheckmark) {
      timer = setTimeout(() => {
        setIsCopied(false);
      }, 3000);
    }

    return () => clearTimeout(timer);
  }, [showCheckmark]);

  useEffect(clearCopiedCheckmark, [clearCopiedCheckmark]);

  // Once another entry becomes the selected one, drop this entry's lingering
  // "copied" paperclip so it returns to hover-only behavior.
  useEffect(() => {
    if (!isSelected) {
      setWasCopied(false);
    }
  }, [isSelected]);

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
        data-testid="PaperclipReveal"
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
