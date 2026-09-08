import { Popover } from 'radix-ui';
import { Suspense, useEffect, useRef, useState } from 'react';
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
import { useBoardPageScrollHandler } from '~/utils/useBoardPageScrollRef';
import { EditCardTitle, type EditCardTitleProps } from './EditCardTitle';

type EditCardPopoverActionsProps = {
  cardId: string;
  listId: string;
  open: boolean;
  onOpenCard: () => void;
  onClose: () => void;
} & Omit<EditCardTitleProps, 'id'>;

export function EditCardPopoverActions({
  title,
  description,
  editedTitle,
  cardId,
  listId,
  open,
  onOpenCard,
  onClose,
  setEditedTitle,
  handleEditOpenChange,
}: EditCardPopoverActionsProps) {
  const [isMoveOpen, setIsMoveOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const deleteCard = useDeleteCard();
  const popoverRef = useRef<HTMLDivElement>(null);
  const boardScrollHandlers = useBoardPageScrollHandler();

  function handleOpenCard() {
    onClose();
    onOpenCard();
  }

  function copyLinkToCardPage() {
    const url = `${window.location.origin}/card/${cardId.slice(0, 8)}`;
    navigator.clipboard.writeText(url);
    setIsCopied(true);
  }

  function deleteCardAndClosePopover() {
    deleteCard({ cardId, listId });
    onClose();
  }

  useEffect(() => {
    if (!open) {
      setIsMoveOpen(false);
      setIsCopied(false);
    }
  }, [open]);

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <Popover.Portal>
      <EditCardPopoverContent
        ref={popoverRef}
        side="right"
        align="start"
        sideOffset={-260}
        {...boardScrollHandlers}
      >
        <EditCardTitle
          id={cardId}
          listId={listId}
          title={title}
          description={description}
          editedTitle={editedTitle}
          setEditedTitle={setEditedTitle}
          handleEditOpenChange={handleEditOpenChange}
        />

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
                    <MoveCardForm id={cardId} onMoved={onClose} />
                  </Suspense>
                </MoveCardFormContainer>
              </MoveCardViewPanel>
            )}
          </MoveCardOptionWrapper>

          <EditCardActionOption onClick={copyLinkToCardPage}>
            <CopyLinkIconContainer data-copied={isCopied ? '' : undefined}>
              {isCopied ? <AiOutlineCheck size={10} /> : <GoLink size={16} />}
            </CopyLinkIconContainer>
            Copy link
          </EditCardActionOption>

          <EditCardActionOption onClick={deleteCardAndClosePopover}>
            <LuArchive size={16} />
            Archive
          </EditCardActionOption>
        </EditCardActionsContainer>
      </EditCardPopoverContent>
    </Popover.Portal>
  );
}
