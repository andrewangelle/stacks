import { useState } from 'react';
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
  ACTIVITY_COLUMN_DEFAULT_WIDTH,
  CARD_MODAL_WIDE_LAYOUT_QUERY,
  CardModalColumnResize,
} from '~/components/Cards/CardModalColumnResize';
import { CardModalDescription } from '~/components/Cards/CardModalDescription';
import { CardModalEditableTitle } from '~/components/Cards/CardModalEditableTitle';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { CardModalChecklists } from '~/components/Checklists/CardModalChecklists';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import { ListCardContainer } from '~/components/Lists/List.styled';
import type { ListCardType } from '~/query/cards';

type CardModalProps = ListCardType & {
  listId: string;
  listName: string;
};

export function CardModal({
  id,
  listId,
  listName,
  cardTitle,
  cardDescription,
  createdAt,
  userId,
}: CardModalProps) {
  const [columnWidth, setColumnWidth] = useState(ACTIVITY_COLUMN_DEFAULT_WIDTH);
  const [isWideLayout, setIsWideLayout] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(CARD_MODAL_WIDE_LAYOUT_QUERY).matches
      : true,
  );

  const gridTemplateColumns = `minmax(0, 1fr) 8px ${columnWidth}px`;
  const cardModalBodyStyle = isWideLayout ? { gridTemplateColumns } : undefined;
  return (
    <CardModalRoot data-testid="CardModalRoot">
      <CardModalTrigger data-testid="CardModalTrigger">
        <ListCardContainer data-testid="ListCardContainer">
          {cardTitle}
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
                <CardModalEditableTitle id={id} listId={listId} />

                <CardModalActionsContainer data-testid="CardModalActionsContainer">
                  <CreateChecklist listId={listId} cardId={id} />

                  <DeleteCardPopover
                    id={id}
                    listId={listId}
                    cardTitle={cardTitle}
                    cardDescription={cardDescription}
                    createdAt={createdAt}
                    userId={userId}
                    listName={listName}
                  />
                </CardModalActionsContainer>

                <CardModalDescription
                  listId={listId}
                  cardId={id}
                  cardTitle={cardTitle}
                  cardDescription={cardDescription}
                />

                <CardModalChecklists cardId={id} />
              </CardModalMainColumn>

              <CardModalColumnResize
                columnWidth={columnWidth}
                setColumnWidth={setColumnWidth}
                setIsWideLayout={setIsWideLayout}
              />

              <CardModalActivityColumn data-testid="CardModalActivityColumn">
                <CardModalActivity listId={listId} cardId={id} />
              </CardModalActivityColumn>
            </CardModalBody>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
