import { CardModalActivity } from '~/components/Activity/CardModalActivity';
import {
  CardModalActionsContainer,
  CardModalActivityColumn,
  CardModalBody,
  CardModalClose,
  CardModalCloseContainer,
  CardModalContent,
  CardModalMainColumn,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
  CardModalTrigger,
} from '~/components/Cards/CardModal.styled';
import {
  CardModalColumnResize,
  useCardColumnWidth,
} from '~/components/Cards/CardModalColumnResize';
import { CardModalDescription } from '~/components/Cards/CardModalDescription';
import { CardModalEditableTitle } from '~/components/Cards/CardModalEditableTitle';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { CardModalChecklists } from '~/components/Checklists/Checklists';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import {
  ListCardContainer,
  ListCardSkeleton,
} from '~/components/Lists/List.styled';
import { useGetCardById } from '~/query/cards';

export function CardModal({ id }: { id: string }) {
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
              <CardModalMainColumn data-testid="CardModalMainColumn">
                <CardModalEditableTitle id={id} />

                <CardModalActionsContainer data-testid="CardModalActionsContainer">
                  <CreateChecklist cardId={id} />
                  <DeleteCardPopover id={id} />
                </CardModalActionsContainer>

                <CardModalDescription cardId={id} />

                <CardModalChecklists cardId={id} />
              </CardModalMainColumn>

              <CardModalColumnResize
                columnWidth={columnWidth}
                setColumnWidth={setColumnWidth}
              />

              <CardModalActivityColumn data-testid="CardModalActivityColumn">
                <CardModalActivity cardId={id} />
              </CardModalActivityColumn>
            </CardModalBody>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
