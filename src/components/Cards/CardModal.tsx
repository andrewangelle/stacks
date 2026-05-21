import { useState } from 'react';
import * as Bs from 'react-icons/bs';
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
  CardModalTitle,
  CardModalTitleContainer,
  CardModalTrigger,
  EditCardTitleCancelButton,
  EditCardTitleInput,
  EditCardTitleSaveButton,
} from '~/components/Cards/CardModal.styled';
import { CardModalDescription } from '~/components/Cards/CardModalDescription';
import { DeleteCardPopover } from '~/components/Cards/DeleteCardPopover';
import { CardModalChecklists } from '~/components/Checklists/CardModalChecklists';
import { CreateChecklist } from '~/components/Checklists/CreateChecklist';
import { ListCardContainer } from '~/components/Lists/List.styled';
import { type ListCardType, useUpdateCardMutation } from '~/query/cards';
import { Flex } from '~/styles/Page.styled';

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
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(cardTitle);
  const [updateCard] = useUpdateCardMutation();

  function onSave() {
    updateCard({
      cardDescription: cardDescription,
      cardTitle: editedTitle,
      cardId: id,
      listId: listId,
    });
    setEditingTitle(false);
  }
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

            <CardModalBody data-testid="CardModalBody">
              <CardModalMainColumn data-testid="CardModalMainColumn">
                <CardModalTitleContainer data-testid="CardModalTitleContainer">
                  <Bs.BsCardHeading size={24} />

                  {!isEditingTitle && (
                    <CardModalTitle
                      data-testid="CardModalTitle"
                      onClick={() => {
                        setEditingTitle(true);
                      }}
                    >
                      {cardTitle}
                    </CardModalTitle>
                  )}

                  {isEditingTitle && (
                    <div style={{ position: 'relative' }}>
                      <Flex data-testid="Flex">
                        <EditCardTitleInput
                          data-testid="EditCardTitleInput"
                          value={editedTitle}
                          onChange={(event) =>
                            setEditedTitle((_prevState) => event.target.value)
                          }
                        />
                        <EditCardTitleSaveButton
                          data-testid="EditCardTitleSaveButton"
                          onClick={onSave}
                        >
                          Save
                        </EditCardTitleSaveButton>
                        <EditCardTitleCancelButton
                          data-testid="EditCardTitleCancelButton"
                          secondary
                          onClick={() => setEditingTitle(false)}
                        >
                          Cancel
                        </EditCardTitleCancelButton>
                      </Flex>
                    </div>
                  )}
                </CardModalTitleContainer>

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
