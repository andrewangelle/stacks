import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import { CardModalActivity } from '~/components/Activity/CardModalActivity';
import {
  CardModalClose,
  CardModalContent,
  CardModalListName,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
  CardModalSiderContainer,
  CardModalSiderTitle,
  CardModalTitle,
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
import { Flex, Padding } from '~/styles/Page.styled';

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
            <CardModalClose data-testid="CardModalClose">X</CardModalClose>

            <Padding padding="15px">
              <Flex data-testid="Flex">
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
              </Flex>

              <CardModalListName data-testid="CardModalListName">{`in list ${listName}`}</CardModalListName>

              <CardModalDescription
                listId={listId}
                cardId={id}
                cardTitle={cardTitle}
                cardDescription={cardDescription}
              />

              <CardModalChecklists cardId={id} />

              <CardModalActivity listId={listId} cardId={id} />

              <CardModalSiderContainer data-testid="CardModalSiderContainer">
                <CardModalSiderTitle data-testid="CardModalSiderTitle">
                  Add to card
                </CardModalSiderTitle>

                <CreateChecklist listId={listId} cardId={id} />

                <CardModalSiderTitle data-testid="CardModalSiderTitle">
                  Actions
                </CardModalSiderTitle>

                <DeleteCardPopover
                  id={id}
                  listId={listId}
                  cardTitle={cardTitle}
                  cardDescription={cardDescription}
                  createdAt={createdAt}
                  userId={userId}
                  listName={listName}
                />
              </CardModalSiderContainer>
            </Padding>
          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  );
}
