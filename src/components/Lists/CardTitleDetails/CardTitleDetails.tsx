import { Popover } from 'radix-ui';
import { type MouseEvent, Suspense, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
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
import { EditCardPopoverOverlay } from '~/components/Lists/EditCardPopover/EditCardPopover.styled';
import { EditCardPopoverTrigger } from '~/components/Lists/EditCardPopover/EditCardPopoverTrigger';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { useBoardPageScrollHandler } from '~/utils/useBoardPageScrollRef';
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
  const wasEditOpenRef = useRef(false);
  const boardScrollHandlers = useBoardPageScrollHandler();

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

  function openEditCardPopover(event: MouseEvent) {
    if (!isEditOpen && (isHovering || isFocused)) {
      event.preventDefault();
      handleEditOpenChange(true);
    }
  }

  useEffect(() => {
    if (isEditOpen && ref.current) {
      ref.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  }, [isEditOpen, ref.current]);

  return (
    <Popover.Root open={isEditOpen} onOpenChange={handleEditOpenChange}>
      <CardModalTrigger
        onClick={handleCardClick}
        onContextMenu={openEditCardPopover}
      >
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
            <ListCardTitleDetailsContainer $isCompleted={isCompleted}>
              <CardCompletedIndicator
                cardId={id}
                visible={isHovering || isFocused}
              />
              {title}
            </ListCardTitleDetailsContainer>

            <Suspense fallback={<CardTitleDetailsContentSkeleton />}>
              <CardTitleDetailsContent
                cardId={id}
                description={description}
                onShowMore={onShowMore}
              />
            </Suspense>

            <EditCardPopoverTrigger
              isOpen={isEditOpen}
              isInteractive={!isEditOpen && (isHovering || isFocused)}
            />

            {isLoading && (
              <CardTitleDetailsSpinnerContainer>
                <CardTitleDetailsSpinner data-testid="CardTitleDetailsSpinner" />
              </CardTitleDetailsSpinnerContainer>
            )}
          </ListCardContainer>
        </Popover.Anchor>
      </CardModalTrigger>

      {isEditOpen &&
        createPortal(
          <EditCardPopoverOverlay {...boardScrollHandlers} />,
          document.body,
        )}

      <EditCardPopoverActions
        cardId={id}
        listId={listId}
        open={isEditOpen}
        onOpenCard={open}
        onClose={() => handleEditOpenChange(false)}
        title={title}
        description={description}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        handleEditOpenChange={handleEditOpenChange}
      />
    </Popover.Root>
  );
}
