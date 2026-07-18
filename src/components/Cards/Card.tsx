import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ActivityPanel } from '~/components/Activity/ActivityPanel';
import {
  CardActionsContainer,
  CardActivityColumn,
  CardMainColumn,
  CardModalBody,
  CardModalContent,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
  CardPageActivityColumn,
  CardPageContent,
} from '~/components/Cards/Card.styled';
import { CardColumnResize } from '~/components/Cards/CardColumnResize';
import { CardDescription } from '~/components/Cards/CardDescription';
import { CardEditableTitle } from '~/components/Cards/CardEditableTitle';
import { CardHeader } from '~/components/Cards/CardHeader/CardHeader';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { ChecklistSkeleton } from '~/components/Checklists/ChecklistSkeleton';
import { CardChecklists } from '~/components/Checklists/Checklists';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import { usePreventModalCloseOnDevToolsEvent } from '~/components/DevTools';
import { useCardColumnWidth } from '~/utils/useCardColumnWidth';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

type CardProps = {
  variant?: 'modal' | 'page';
};

export function Card({ variant = 'modal' }: CardProps) {
  const cardId = useCurrentCardId();
  const boardId = useCurrentBoardId();
  const navigate = useNavigate();
  const { isLoading: isRouteLoading } = useRouterState();
  const [isClosingCard, setIsClosingCard] = useState(false);
  const { columnWidth, setColumnWidth, isWideLayout } = useCardColumnWidth();
  const mainColumnRef = useRef<HTMLDivElement>(null);
  const preventCloseOnDevToolsEvent = usePreventModalCloseOnDevToolsEvent();

  const gridTemplateColumns = `minmax(0, 1fr) 8px ${columnWidth}px`;
  const cardModalBodyStyle = isWideLayout ? { gridTemplateColumns } : undefined;

  useEffect(() => {
    if (!isRouteLoading) {
      setIsClosingCard(false);
    }
  }, [isRouteLoading]);

  function handleOpenChange(open: boolean) {
    if (open) {
      return;
    }

    setIsClosingCard(true);
    navigate({
      to: '/board/$id',
      params: { id: boardId },
      hash: '',
      search: { from: `card-${cardId}` },
    });
  }

  const isPage = variant === 'page';
  const ActivityColumn = isPage ? CardPageActivityColumn : CardActivityColumn;

  const cardBody = (
    <>
      <CardHeader
        cardId={cardId}
        isNavigating={isRouteLoading && isClosingCard}
        asPage={isPage}
      />

      <CardModalBody data-testid="CardModalBody" style={cardModalBodyStyle}>
        <CardMainColumn data-testid="CardMainColumn" ref={mainColumnRef}>
          <CardEditableTitle />

          <CardActionsContainer data-testid="CardActionsContainer">
            <CreateChecklist />
            <DeleteCardPopover />
          </CardActionsContainer>

          <CardDescription />

          <Suspense
            fallback={
              <ChecklistsContainer data-testid="ChecklistsContainer">
                <ChecklistSkeleton />
              </ChecklistsContainer>
            }
          >
            <CardChecklists />
          </Suspense>
        </CardMainColumn>

        {isWideLayout && (
          <CardColumnResize
            columnWidth={columnWidth}
            setColumnWidth={setColumnWidth}
          />
        )}

        <ActivityColumn data-testid="CardActivityColumn">
          <ActivityPanel />
        </ActivityColumn>
      </CardModalBody>
    </>
  );

  if (isPage) {
    return (
      <CardModalRoot
        data-testid="CardModalRoot"
        open
        modal={false}
        onOpenChange={handleOpenChange}
      >
        <CardPageContent
          data-testid="CardModalContent"
          aria-describedby={undefined}
          onCloseAutoFocus={(event) => {
            event.preventDefault();
          }}
          onInteractOutside={(event) => {
            event.preventDefault();
          }}
        >
          {cardBody}
        </CardPageContent>
      </CardModalRoot>
    );
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
            onPointerDownOutside={preventCloseOnDevToolsEvent}
          >
            {cardBody}
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
