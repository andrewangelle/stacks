import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import { CardModalActivity } from '~/components/CardModalActivity';
import { CardModalChecklists } from '~/components/CardModalChecklists';
import { CardModalDescription } from '~/components/CardModalDescription';
import { CreateChecklist } from '~/components/CreateChecklist';
import { DeleteCardPopover } from '~/components/DeleteCardPopover';
import { type ListCardType, useUpdateCardMutation } from '~/store/cardsApi';
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
} from '~/styles/CardModal';
import { ListCardContainer } from '~/styles/List';
import { Flex, Padding } from '~/styles/Page';

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
  created_at,
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
    <CardModalRoot>
      <CardModalTrigger>
        <ListCardContainer>{cardTitle}</ListCardContainer>
      </CardModalTrigger>

      <CardModalPortal>
        <CardModalOverlay>
          <CardModalContent>
            <CardModalClose>X</CardModalClose>

            <Padding padding="15px">
              <Flex>
                <Bs.BsCardHeading size={24} />

                {!isEditingTitle && (
                  <CardModalTitle
                    onClick={() => {
                      setEditingTitle(true);
                    }}
                  >
                    {cardTitle}
                  </CardModalTitle>
                )}

                {isEditingTitle && (
                  <div style={{ position: 'relative' }}>
                    <Flex>
                      <EditCardTitleInput
                        value={editedTitle}
                        onChange={(event) =>
                          setEditedTitle((_prevState) => event.target.value)
                        }
                      />
                      <EditCardTitleSaveButton onClick={onSave}>
                        Save
                      </EditCardTitleSaveButton>
                      <EditCardTitleCancelButton
                        secondary
                        onClick={() => setEditingTitle(false)}
                      >
                        Cancel
                      </EditCardTitleCancelButton>
                    </Flex>
                  </div>
                )}
              </Flex>

              <CardModalListName>{`in list ${listName}`}</CardModalListName>

              <CardModalDescription
                listId={listId}
                cardId={id}
                cardTitle={cardTitle}
                cardDescription={cardDescription}
              />

              <CardModalChecklists cardId={id} />

              <CardModalActivity listId={listId} cardId={id} />

              <CardModalSiderContainer>
                <CardModalSiderTitle>Add to card</CardModalSiderTitle>

                <CreateChecklist listId={listId} cardId={id} />

                <CardModalSiderTitle>Actions</CardModalSiderTitle>

                <DeleteCardPopover
                  id={id}
                  listId={listId}
                  cardTitle={cardTitle}
                  cardDescription={cardDescription}
                  created_at={created_at}
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
