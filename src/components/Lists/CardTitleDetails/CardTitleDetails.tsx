import { Popover } from 'radix-ui';
import { type MouseEvent, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { LuPencil } from 'react-icons/lu';
import { CardModalTrigger } from '~/components/Cards/Card.styled';
import { CardCompletedIndicator } from '~/components/Cards/CardCompletedIndicator';
import {
  CardTitleDetailsContentSkeleton,
  CardTitleDetailsSpinner,
  CardTitleDetailsSpinnerContainer,
  ListCardTitleDetailsContainer,
} from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { CardTitleDetailsContent } from '~/components/Lists/CardTitleDetails/CardTitleDetailsContent';
import { EditCardPopoverActions } from '~/components/Lists/EditCardPopover/EditCardPopover';
import {
  EditCardPopoverOverlay,
  EditCardPopoverTrigger,
  EditCardSaveButton,
  EditCardTitleTextarea,
} from '~/components/Lists/EditCardPopover/EditCardPopover.styled';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { Tooltip } from '~/components/shared/Tooltip/Tooltip';
import { useUpdateCard } from '~/db/cards/cards.query';
import { useCardModalTrigger } from '~/utils/useCardModalTrigger';

type CardTitleDetailsProps = {
  id: string;
  listId: string;
  description: string;
  isCompleted: boolean;
  title: string;
};

export function CardTitleDetails({
  id,
  listId,
  title,
  description,
  isCompleted,
}: CardTitleDetailsProps) {
  const {
    ref,
    isHovering,
    isFocused,
    isLoading,
    onBlur,
    onFocus,
    onKeyDown,
    onMouseEnter,
    onMouseLeave,
    onPointerDown,
    onShowMore,
    open,
  } = useCardModalTrigger(id);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const wasEditOpenRef = useRef(false);
  const updateCard = useUpdateCard();

  function handleEditOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      wasEditOpenRef.current = true;
      requestAnimationFrame(() => {
        wasEditOpenRef.current = false;
      });
    }
    setIsEditOpen(nextOpen);
    if (nextOpen) {
      setEditedTitle(title);
    }
  }

  function handleCardClick(e: MouseEvent) {
    if (wasEditOpenRef.current || isEditOpen) {
      e.stopPropagation();
      return;
    }
    open();
  }

  function handleSave() {
    if (editedTitle.trim() && editedTitle !== title) {
      updateCard({ cardId: id, listId, cardTitle: editedTitle.trim() });
    }
    handleEditOpenChange(false);
  }

  useEffect(() => {
    if (isEditOpen && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
    }
  }, [isEditOpen]);

  return (
    <Popover.Root open={isEditOpen} onOpenChange={handleEditOpenChange}>
      <CardModalTrigger onClick={handleCardClick}>
        <Popover.Anchor asChild>
          <ListCardContainer
            ref={ref}
            role="button"
            tabIndex={0}
            data-card-id={id}
            data-edit-open={isEditOpen ? '' : undefined}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            onPointerDown={onPointerDown}
          >
            {isEditOpen ? (
              <EditCardTitleTextarea
                ref={textareaRef}
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSave();
                  }
                }}
              />
            ) : (
              <ListCardTitleDetailsContainer $isCompleted={isCompleted}>
                <CardCompletedIndicator
                  cardId={id}
                  visible={isHovering || isFocused}
                />
                {title}
              </ListCardTitleDetailsContainer>
            )}

            <Suspense fallback={<CardTitleDetailsContentSkeleton />}>
              <CardTitleDetailsContent
                cardId={id}
                description={description}
                onShowMore={onShowMore}
              />
            </Suspense>

            {isEditOpen && (
              <EditCardSaveButton
                onClick={(e) => {
                  e.stopPropagation();
                  handleSave();
                }}
              >
                Save
              </EditCardSaveButton>
            )}

            <Tooltip content="Edit card" disabled={isEditOpen}>
              <Popover.Trigger asChild>
                <EditCardPopoverTrigger
                  data-visible={
                    !isEditOpen && (isHovering || isFocused) ? '' : undefined
                  }
                  onClick={(e) => e.stopPropagation()}
                >
                  <LuPencil size={14} />
                </EditCardPopoverTrigger>
              </Popover.Trigger>
            </Tooltip>

            {isLoading && (
              <CardTitleDetailsSpinnerContainer>
                <CardTitleDetailsSpinner data-testid="CardTitleDetailsSpinner" />
              </CardTitleDetailsSpinnerContainer>
            )}
          </ListCardContainer>
        </Popover.Anchor>
      </CardModalTrigger>

      {isEditOpen && createPortal(<EditCardPopoverOverlay />, document.body)}

      <EditCardPopoverActions
        cardId={id}
        listId={listId}
        open={isEditOpen}
        onOpenCard={open}
        onClose={() => handleEditOpenChange(false)}
      />
    </Popover.Root>
  );
}
