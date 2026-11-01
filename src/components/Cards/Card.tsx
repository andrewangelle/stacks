import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ActivityPanel } from '~/components/Activity/ActivityPanel';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import {
  CardActionsContainer,
  CardActivityCollapse,
  CardActivityCollapseInner,
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
import { CardDescription } from '~/components/Cards/CardDescription/CardDescription';
import { CardEditableTitle } from '~/components/Cards/CardEditableTitle';
import { CardHeader } from '~/components/Cards/CardHeader/CardHeader';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { ChecklistSkeleton } from '~/components/Checklists/ChecklistSkeleton';
import { CardChecklists } from '~/components/Checklists/Checklists';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import {
  type PointerDownOutsideEvent,
  usePreventModalCloseOnDevToolsEvent,
} from '~/components/DevTools';
import { CardDisplayMenu } from '~/components/DisplayMenu/CardDisplayMenu';
import { useCommentsVisible } from '~/db/user/user.query';
import { useCardColumnWidth } from '~/hooks/useCardColumnWidth';
import { useCurrentBoardId } from '~/hooks/useCurrentBoardId';
import { useCurrentCardId } from '~/hooks/useCurrentCardId';
import { useIsMobile } from '~/hooks/useIsMobile';

type CardProps = {
  variant?: 'modal' | 'page';
};

export function Card({ variant = 'modal' }: CardProps) {
  const cardId = useCurrentCardId();
  const boardId = useCurrentBoardId();
  const navigate = useNavigate();
  const { isLoading: isRouteLoading } = useRouterState();
  const [isClosingCard, setIsClosingCard] = useState(false);
  const {
    columnWidth,
    setColumnWidth,
    isResizing,
    setIsResizing,
    isWideLayout,
  } = useCardColumnWidth();
  const mainColumnRef = useRef<HTMLDivElement>(null);
  const cardDisplayMenuRef = useRef<HTMLDivElement>(null);
  const preventCloseOnDevToolsEvent = usePreventModalCloseOnDevToolsEvent();
  const isMobile = useIsMobile();
  const commentsVisible = useCommentsVisible();

  const gridTemplateColumns = `minmax(0, 1fr) 8px ${columnWidth}px`;
  const cardModalBodyStyle =
    isWideLayout && commentsVisible ? { gridTemplateColumns } : undefined;
  const activityInnerStyle = isWideLayout
    ? { minWidth: columnWidth }
    : undefined;

  function handlePointerDownOutside(event: PointerDownOutsideEvent) {
    if (cardDisplayMenuRef.current?.contains(event.target as Node)) {
      event.preventDefault();
      return;
    }

    preventCloseOnDevToolsEvent(event);
  }

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

  function keepOpenOnBoundaryEscape(event: KeyboardEvent) {
    const { target } = event;

    if (target instanceof Element && target.closest('[data-escape-boundary]')) {
      event.preventDefault();
    }
  }

  const isPage = variant === 'page';
  const ActivityColumn = isPage ? CardPageActivityColumn : CardActivityColumn;

  useEffect(() => {
    if (!isRouteLoading) {
      setIsClosingCard(false);
    }
  }, [isRouteLoading]);

  const cardBody = (
    <>
      <CardHeader
        cardId={cardId}
        isNavigating={isRouteLoading && isClosingCard}
        asPage={isPage}
      />

      <CardModalBody
        style={cardModalBodyStyle}
        $commentsVisible={commentsVisible}
        $isResizing={isResizing}
      >
        <CardMainColumn ref={mainColumnRef}>
          <CardEditableTitle />

          <CardActionsContainer>
            <CreateChecklist />
            <DeleteCardPopover />
          </CardActionsContainer>

          <CardDescription />

          <Suspense
            fallback={
              <ChecklistsContainer>
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
            isResizing={isResizing}
            setIsResizing={setIsResizing}
            visible={commentsVisible}
          />
        )}

        <ActivityColumn
          data-testid="CardActivityColumn"
          $visible={commentsVisible}
        >
          <CardActivityCollapse $visible={commentsVisible}>
            <CardActivityCollapseInner style={activityInnerStyle}>
              <Suspense fallback={<ActivitySkeleton />}>
                <ActivityPanel />
              </Suspense>
            </CardActivityCollapseInner>
          </CardActivityCollapse>
        </ActivityColumn>
      </CardModalBody>
    </>
  );

  if (isPage) {
    return (
      <CardModalRoot open modal={false} onOpenChange={handleOpenChange}>
        <CardPageContent
          aria-describedby={undefined}
          onEscapeKeyDown={keepOpenOnBoundaryEscape}
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
    <CardModalRoot open onOpenChange={handleOpenChange}>
      <CardModalPortal>
        <CardModalOverlay $reserveMenuSpace={!isMobile}>
          <CardModalContent
            $reserveMenuSpace={!isMobile}
            $commentsVisible={commentsVisible}
            style={{ '--card-activity-width': `${columnWidth}px` }}
            aria-describedby={undefined}
            onEscapeKeyDown={keepOpenOnBoundaryEscape}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
            }}
            onPointerDownOutside={handlePointerDownOutside}
          >
            {cardBody}
          </CardModalContent>

          {!isMobile && (
            <CardDisplayMenu
              hidden={isClosingCard}
              menuRef={cardDisplayMenuRef}
            />
          )}
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
