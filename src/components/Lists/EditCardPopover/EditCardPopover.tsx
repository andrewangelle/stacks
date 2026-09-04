import { Popover } from 'radix-ui';
import { Suspense, useEffect, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { GoLink } from 'react-icons/go';
import { LuArchive, LuArrowRight, LuExternalLink, LuX } from 'react-icons/lu';
import { MoveCardForm } from '~/components/Cards/MoveCardMenu/MoveCardForm';
import { SelectSkeleton } from '~/components/Cards/MoveCardMenu/MoveCardMenu.styled';
import {
  CopyLinkIconContainer,
  EditCardActionOption,
  EditCardActionsContainer,
  EditCardPopoverContent,
  MoveCardCloseButton,
  MoveCardFormContainer,
  MoveCardOptionWrapper,
  MoveCardViewPanel,
  MoveCardViewPanelHeader,
} from '~/components/Lists/EditCardPopover/EditCardPopover.styled';
import { useDeleteCard } from '~/db/cards/cards.query';

type EditCardPopoverActionsProps = {
  cardId: string;
  listId: string;
  open: boolean;
  onOpenCard: () => void;
  onClose: () => void;
};

export function EditCardPopoverActions({
  cardId,
  listId,
  open: popoverOpen,
  onOpenCard,
  onClose,
}: EditCardPopoverActionsProps) {
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const deleteCard = useDeleteCard();

  useEffect(() => {
    if (!popoverOpen) {
      setIsMoveOpen(false);
      setIsCopied(false);
    }
  }, [popoverOpen]);

  function handleOpenCard() {
    onClose();
    onOpenCard();
  }

  function handleCopyLink() {
    const url = `${window.location.origin}/card/${cardId.slice(0, 8)}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
  }

  function handleArchive() {
    deleteCard({ cardId, listId });
    onClose();
  }

  function handleMoved() {
    onClose();
  }

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <Popover.Portal>
      <EditCardPopoverContent
        side="right"
        align="start"
        sideOffset={8}
        onInteractOutside={(e) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-edit-open]')) {
            e.preventDefault();
          }
        }}
      >
        <EditCardActionsContainer>
          <EditCardActionOption onClick={handleOpenCard}>
            <LuExternalLink size={16} />
            Open card
          </EditCardActionOption>

          <MoveCardOptionWrapper>
            <EditCardActionOption
              data-active={isMoveOpen ? '' : undefined}
              onClick={() => setIsMoveOpen(!isMoveOpen)}
            >
              <LuArrowRight size={16} />
              Move
            </EditCardActionOption>

            {isMoveOpen && (
              <MoveCardViewPanel>
                <MoveCardViewPanelHeader>
                  <span>Move card</span>
                  <MoveCardCloseButton onClick={() => setIsMoveOpen(false)}>
                    <LuX size={16} />
                  </MoveCardCloseButton>
                </MoveCardViewPanelHeader>
                <MoveCardFormContainer>
                  <Suspense
                    fallback={<SelectSkeleton style={{ minHeight: '44px' }} />}
                  >
                    <MoveCardForm id={cardId} onMoved={handleMoved} />
                  </Suspense>
                </MoveCardFormContainer>
              </MoveCardViewPanel>
            )}
          </MoveCardOptionWrapper>

          <EditCardActionOption onClick={handleCopyLink}>
            <CopyLinkIconContainer data-copied={isCopied ? '' : undefined}>
              {isCopied ? <AiOutlineCheck size={10} /> : <GoLink size={16} />}
            </CopyLinkIconContainer>
            Copy link
          </EditCardActionOption>

          <EditCardActionOption onClick={handleArchive}>
            <LuArchive size={16} />
            Archive
          </EditCardActionOption>
        </EditCardActionsContainer>
      </EditCardPopoverContent>
    </Popover.Portal>
  );
}
