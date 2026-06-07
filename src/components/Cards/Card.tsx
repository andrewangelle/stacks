import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef } from 'react';
import { CardActivity } from '~/components/Activity/CardActivity';
import {
  CardActionsContainer,
  CardActivityColumn,
  CardMainColumn,
  CardModalBody,
  CardModalClose,
  CardModalCloseContainer,
  CardModalContent,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
} from '~/components/Cards/Card.styled';
import { CardColumnResize } from '~/components/Cards/CardColumnResize';
import { CardDescription } from '~/components/Cards/CardDescription';
import { CardEditableTitle } from '~/components/Cards/CardEditableTitle';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { CardChecklists } from '~/components/Checklists/Checklists';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import { ListCardSkeleton } from '~/components/Lists/List.styled';
import { useGetCardById } from '~/query/cards';
import { useCardColumnWidth } from '~/utils/useCardColumnWidth';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useHashChecklistId } from '~/utils/useHashChecklistId';

function focusCardTrigger(cardId: string) {
  requestAnimationFrame(() => {
    document
      .querySelector<HTMLElement>(`[data-card-id="${cardId}"]`)
      ?.focus({ preventScroll: true });
  });
}

export function Card({ cardId }: { cardId: string }) {
  const boardId = useCurrentBoardId();
  const navigate = useNavigate();
  const { isLoading } = useGetCardById({ id: cardId });
  const scrollToChecklistId = useHashChecklistId();
  const { columnWidth, setColumnWidth, isWideLayout } = useCardColumnWidth();
  const mainColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scrollToChecklistId) {
      return;
    }

    mainColumnRef.current?.scrollTo({ top: 0 });
  }, [scrollToChecklistId]);

  const gridTemplateColumns = `minmax(0, 1fr) 8px ${columnWidth}px`;
  const cardModalBodyStyle = isWideLayout ? { gridTemplateColumns } : undefined;

  function handleOpenChange(open: boolean) {
    if (open) {
      return;
    }

    navigate({ to: '/board/$id', params: { id: boardId } });
    focusCardTrigger(cardId);
  }

  if (isLoading) {
    return <ListCardSkeleton />;
  }

  return (
    <CardModalRoot
      data-testid="CardModalRoot"
      open
      onOpenChange={handleOpenChange}
    >
      <CardModalPortal data-testid="CardModalPortal">
        <CardModalOverlay data-testid="CardModalOverlay">
          <CardModalContent
            data-testid="CardModalContent"
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
            }}
          >
            <CardModalCloseContainer data-testid="CardModalCloseContainer">
              <CardModalClose data-testid="CardModalClose">X</CardModalClose>
            </CardModalCloseContainer>

            <CardModalBody
              data-testid="CardModalBody"
              style={cardModalBodyStyle}
            >
              <CardMainColumn data-testid="CardMainColumn" ref={mainColumnRef}>
                <CardEditableTitle id={cardId} />

                <CardActionsContainer data-testid="CardActionsContainer">
                  <CreateChecklist cardId={cardId} />
                  <DeleteCardPopover id={cardId} />
                </CardActionsContainer>

                <CardDescription cardId={cardId} />

                <CardChecklists
                  cardId={cardId}
                  scrollToChecklistId={scrollToChecklistId}
                />
              </CardMainColumn>

              {isWideLayout && (
                <CardColumnResize
                  columnWidth={columnWidth}
                  setColumnWidth={setColumnWidth}
                />
              )}

              <CardActivityColumn data-testid="CardActivityColumn">
                <CardActivity cardId={cardId} />
              </CardActivityColumn>
            </CardModalBody>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
