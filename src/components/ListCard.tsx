import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { CardModal } from '~/components/CardModal';
import { DeleteListPopover } from '~/components/DeleteListPopover';
import { DragDropCard } from '~/components/DragDropCard';
import { useCreateCardMutation, useGetCardsQuery } from '~/store/cardsApi';
import { type List, useUpdateListMutation } from '~/store/listsApi';
import {
  AddCardButton,
  AddCardInput,
  AddCardText,
  CloseAddCardButton,
  ListContainer,
  ListName,
} from '~/styles/List';
import { Flex } from '~/styles/Page';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function ListCard({ id, listTitle }: List) {
  const params = useParams({ strict: false });
  const [isEditing, setEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [editedListTitle, setEditedListTitle] = useState(listTitle);
  const { data: cards } = useGetCardsQuery({ listId: id });
  const outsideClickRef = useOutsideClick(
    onOutsideNameEditClick,
    isEditingName,
  );
  const [updateList] = useUpdateListMutation();
  const [createCard] = useCreateCardMutation();

  function onOutsideNameEditClick() {
    setIsEditingName(false);

    if (editedListTitle !== listTitle) {
      updateList({
        boardId: params.id ?? '',
        listId: id,
        listTitle: editedListTitle,
      });
    }
  }

  function onCardCreate() {
    createCard({
      cardTitle,
      listId: id,
    });
    setEditing(false);
  }

  return (
    <ListContainer key={id}>
      <div ref={outsideClickRef}>
        {!isEditingName && (
          <ListName onClick={() => setIsEditingName(true)}>
            {listTitle}
          </ListName>
        )}

        {isEditingName && (
          <AddCardInput
            value={editedListTitle}
            onChange={(event) =>
              setEditedListTitle((_prevState) => event.target.value)
            }
          />
        )}
      </div>

      {!isEditingName && <DeleteListPopover id={id} listTitle={listTitle} />}

      {isEditing && (
        <AddCardInput
          value={cardTitle}
          onChange={(event) => setCardTitle((_prevState) => event.target.value)}
        />
      )}

      {cards?.map((card) => (
        <DragDropCard
          key={card.id}
          id={card.id}
          listId={id}
          cardTitle={card.cardTitle}
        >
          <CardModal {...card} listName={listTitle} listId={id} />
        </DragDropCard>
      ))}

      <Flex>
        {!isEditing && (
          <AddCardText onClick={() => setEditing(true)}>
            + Add a card
          </AddCardText>
        )}
        {isEditing && (
          <AddCardButton onClick={onCardCreate}>Add card</AddCardButton>
        )}
        {isEditing && (
          <CloseAddCardButton secondary onClick={() => setEditing(false)}>
            X
          </CloseAddCardButton>
        )}
      </Flex>
    </ListContainer>
  );
}
