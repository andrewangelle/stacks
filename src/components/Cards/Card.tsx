import { useNavigate, useRouterState } from '@tanstack/react-router';
import { Suspense, useEffect, useRef, useState } from 'react';
import { ActivityPanel } from '~/components/Activity/ActivityPanel';
import {
  CardActionsContainer,
  CardActivityColumn,
  CardMainColumn,
  CardModalBody,
  CardModalClose,
  CardModalCloseContainer,
  CardModalCloseSpinnerSlot,
  CardModalContent,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
} from '~/components/Cards/Card.styled';
import { CardColumnResize } from '~/components/Cards/CardColumnResize';
import { CardDescription } from '~/components/Cards/CardDescription';
import { CardEditableTitle } from '~/components/Cards/CardEditableTitle';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { ChecklistSkeleton } from '~/components/Checklists/ChecklistSkeleton';
import { CardChecklists } from '~/components/Checklists/Checklists';
import { ChecklistsContainer } from '~/components/Checklists/Checklists.styled';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import { usePreventDevToolsClose } from '~/components/DevTools';
import { CardTitleDetailsSpinner } from '~/components/Lists/CardTitleDetails/CardTitleDetails.styled';
import { useCardColumnWidth } from '~/utils/useCardColumnWidth';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function Card() {
  const cardId = useCurrentCardId();
  const boardId = useCurrentBoardId();
  const navigate = useNavigate();
  const { isLoading: isRouteLoading } = useRouterState();
  const [isClosingCard, setIsClosingCard] = useState(false);
  const { columnWidth, setColumnWidth, isWideLayout } = useCardColumnWidth();
  const mainColumnRef = useRef<HTMLDivElement>(null);
  const preventDevToolsClose = usePreventDevToolsClose();

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
            onPointerDownOutside={preventDevToolsClose}
          >
            <CardModalCloseContainer data-testid="CardModalCloseContainer">
              {isRouteLoading && isClosingCard && (
                <CardModalCloseSpinnerSlot data-testid="CardModalCloseSpinner">
                  <CardTitleDetailsSpinner />
                </CardModalCloseSpinnerSlot>
              )}

              {!isRouteLoading && !isClosingCard && (
                <CardModalClose data-testid="CardModalClose">X</CardModalClose>
              )}
            </CardModalCloseContainer>

            <CardModalBody
              data-testid="CardModalBody"
              style={cardModalBodyStyle}
            >
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

              <CardActivityColumn data-testid="CardActivityColumn">
                <ActivityPanel />
              </CardActivityColumn>
            </CardModalBody>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
