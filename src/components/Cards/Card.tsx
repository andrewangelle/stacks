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
  CardModalTrigger,
} from '~/components/Cards/Card.styled';
import {
  CardColumnResize,
  useCardColumnWidth,
} from '~/components/Cards/CardColumnResize';
import { CardDescription } from '~/components/Cards/CardDescription';
import { CardEditableTitle } from '~/components/Cards/CardEditableTitle';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { CardChecklists } from '~/components/Checklists/Checklists';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import {
  ListCardContainer,
  ListCardSkeleton,
} from '~/components/Lists/List.styled';
import { useGetCardById } from '~/query/cards';

export function Card({ id }: { id: string }) {
  const { data, isLoading } = useGetCardById({ id });
  const { columnWidth, setColumnWidth, isWideLayout } = useCardColumnWidth();

  const gridTemplateColumns = `minmax(0, 1fr) 8px ${columnWidth}px`;
  const cardModalBodyStyle = isWideLayout ? { gridTemplateColumns } : undefined;

  if (isLoading) {
    return <ListCardSkeleton />;
  }

  return (
    <CardModalRoot data-testid="CardModalRoot">
      <CardModalTrigger data-testid="CardModalTrigger">
        <ListCardContainer data-testid="ListCardContainer">
          {data?.cardTitle}
        </ListCardContainer>
      </CardModalTrigger>

      <CardModalPortal data-testid="CardModalPortal">
        <CardModalOverlay data-testid="CardModalOverlay">
          <CardModalContent data-testid="CardModalContent">
            <CardModalCloseContainer data-testid="CardModalCloseContainer">
              <CardModalClose data-testid="CardModalClose">X</CardModalClose>
            </CardModalCloseContainer>

            <CardModalBody
              data-testid="CardModalBody"
              style={cardModalBodyStyle}
            >
              <CardMainColumn data-testid="CardMainColumn">
                <CardEditableTitle id={id} />

                <CardActionsContainer data-testid="CardActionsContainer">
                  <CreateChecklist cardId={id} />
                  <DeleteCardPopover id={id} />
                </CardActionsContainer>

                <CardDescription cardId={id} />

                <CardChecklists cardId={id} />
              </CardMainColumn>

              {isWideLayout && (
                <CardColumnResize
                  columnWidth={columnWidth}
                  setColumnWidth={setColumnWidth}
                />
              )}

              <CardActivityColumn data-testid="CardActivityColumn">
                <CardActivity cardId={id} />
              </CardActivityColumn>
            </CardModalBody>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
