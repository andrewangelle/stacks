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
import { useGetCardByListId } from '~/db/lists/lists.query';
import { useBoardPageScrollHandler } from '~/hooks/useBoardPageScrollRef';
import { useCardModalTrigger } from '~/hooks/useCardModalTrigger';
import { useListId } from '~/hooks/useListId';

type CardTitleDetailsProps = {
  id: string;
};

export function CardTitleDetails({ id }: CardTitleDetailsProps) {
  const listId = useListId();
  const { data: card } = useGetCardByListId({ listId, cardId: id });
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
  const [editedTitle, setEditedTitle] = useState(card?.cardTitle);
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
      setEditedTitle(card?.cardTitle);
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
            <ListCardTitleDetailsContainer
              $isCompleted={card?.isCompleted ?? false}
            >
              <CardCompletedIndicator
                cardId={id}
                visible={isHovering || isFocused}
              />
              {card?.cardTitle}
            </ListCardTitleDetailsContainer>

            <Suspense fallback={<CardTitleDetailsContentSkeleton />}>
              <CardTitleDetailsContent cardId={id} onShowMore={onShowMore} />
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
          <EditCardPopoverOverlay
            {...boardScrollHandlers}
            onClick={() => handleEditOpenChange(false)}
          />,
          document.body,
        )}

      <EditCardPopoverActions
        cardId={id}
        open={isEditOpen}
        onOpenCard={open}
        onClose={() => handleEditOpenChange(false)}
        editedTitle={editedTitle ?? ''}
        setEditedTitle={setEditedTitle}
        handleEditOpenChange={handleEditOpenChange}
      />
    </Popover.Root>
  );
}
