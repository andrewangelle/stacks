import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Dialog } from 'radix-ui';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ActivityPanel } from '~/components/Activity/ActivityPanel';
import { ActivitySkeleton } from '~/components/Activity/ActivitySkeleton';
import * as cardStyles from '~/components/Cards/Card.css';
import { CardColumnResize } from '~/components/Cards/CardColumnResize';
import { CardDescription } from '~/components/Cards/CardDescription';
import { CardEditableTitle } from '~/components/Cards/CardEditableTitle';
import { CardHeader } from '~/components/Cards/CardHeader/CardHeader';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { ChecklistSkeleton } from '~/components/Checklists/ChecklistSkeleton';
import { CardChecklists } from '~/components/Checklists/Checklists';
import * as checklistsStyles from '~/components/Checklists/Checklists.css';
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
  const activityColumnClassName = isPage
    ? cardStyles.cardPageActivityColumn
    : cardStyles.cardActivityColumn;

  const cardBody = (
    <>
      <CardHeader
        cardId={cardId}
        isNavigating={isRouteLoading && isClosingCard}
        asPage={isPage}
      />

      <div
        className={cardStyles.cardModalBody}
        data-testid="CardModalBody"
        style={cardModalBodyStyle}
      >
        <div
          className={cardStyles.cardMainColumn}
          data-testid="CardMainColumn"
          ref={mainColumnRef}
        >
          <CardEditableTitle />

          <div
            className={cardStyles.cardActionsContainer}
            data-testid="CardActionsContainer"
          >
            <CreateChecklist />
            <DeleteCardPopover />
          </div>

          <CardDescription />

          <Suspense
            fallback={
              <div
                className={checklistsStyles.checklistsContainer}
                data-testid="ChecklistsContainer"
              >
                <ChecklistSkeleton />
              </div>
            }
          >
            <CardChecklists />
          </Suspense>
        </div>

        {isWideLayout && (
          <CardColumnResize
            columnWidth={columnWidth}
            setColumnWidth={setColumnWidth}
          />
        )}

        <div
          className={activityColumnClassName}
          data-testid="CardActivityColumn"
        >
          <Suspense fallback={<ActivitySkeleton />}>
            <ActivityPanel />
          </Suspense>
        </div>
      </div>
    </>
  );

  if (isPage) {
    return (
      <Dialog.Root
        data-testid="CardModalRoot"
        open
        modal={false}
        onOpenChange={handleOpenChange}
      >
        <Dialog.Content
          className={cardStyles.cardPageContent}
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
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root
      data-testid="CardModalRoot"
      open
      onOpenChange={handleOpenChange}
    >
      <Dialog.Portal data-testid="CardModalPortal">
        <Dialog.Overlay
          className={cardStyles.cardModalOverlay}
          data-testid="CardModalOverlay"
        >
          <Dialog.Content
            className={cardStyles.cardModalContent}
            data-testid="CardModalContent"
            aria-describedby={undefined}
            onCloseAutoFocus={(event) => {
              event.preventDefault();
            }}
            onPointerDownOutside={preventCloseOnDevToolsEvent}
          >
            {cardBody}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
