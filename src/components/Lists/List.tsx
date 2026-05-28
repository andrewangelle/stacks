import type { List as ListType } from '@prisma/client';
import { useParams } from '@tanstack/react-router';
import { useState } from 'react';
import { CardModal } from '~/components/Cards/CardModal';
import { DragDropCard } from '~/components/Cards/DragDropCard';
import { DeleteListPopover } from '~/components/Lists/DeleteListPopover';
import {
  AddCardButton,
  AddCardInput,
  AddCardText,
  CloseAddCardButton,
  ListContainer,
  ListName,
} from '~/components/Lists/List.styled';
import { useCreateCardMutation, useGetCardsQuery } from '~/query/cards';
import { useGetListByIdQuery, useUpdateListMutation } from '~/query/lists';
import { Flex } from '~/styles/Page.styled';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function List({ id }: Pick<ListType, 'id'>) {
  const { data } = useGetListByIdQuery({ id });
  const params = useParams({ strict: false });
  const [isEditing, setEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [cardTitle, setCardTitle] = useState('');
  const [editedListTitle, setEditedListTitle] = useState('');
  const { data: cards } = useGetCardsQuery({ listId: id });
  const outsideClickRef = useOutsideClick(
    onOutsideNameEditClick,
    isEditingName,
  );
  const [updateList] = useUpdateListMutation();
  const [createCard] = useCreateCardMutation();

  function onOutsideNameEditClick() {
    setIsEditingName(false);

    if (editedListTitle !== data?.listTitle) {
      updateList({
        id,
        boardId: params.id ?? '',
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
    setCardTitle('');
  }

  console.log(data);
  return (
    <ListContainer data-testid="ListContainer" key={id}>
      <div ref={outsideClickRef}>
        {!isEditingName && (
          <ListName
            data-testid="ListName"
            onClick={() => {
              setIsEditingName(true);
              setEditedListTitle(data?.listTitle ?? '');
            }}
          >
            {data?.listTitle}
          </ListName>
        )}

        {isEditingName && (
          <AddCardInput
            data-testid="AddCardInput"
            value={editedListTitle}
            autoFocus
            onChange={(event) =>
              setEditedListTitle((_prevState) => event.target.value)
            }
          />
        )}
      </div>

      {!isEditingName && (
        <DeleteListPopover id={id} listTitle={data?.listTitle ?? ''} />
      )}

      {cards?.map((card) => (
        <DragDropCard
          key={card.id}
          id={card.id}
          listId={id}
          cardTitle={card.cardTitle}
        >
          <CardModal id={card.id} listTitle={data?.listTitle ?? ''} />
        </DragDropCard>
      ))}

      {isEditing && (
        <AddCardInput
          data-testid="AddCardInput"
          value={cardTitle}
          placeholder="Enter a title"
          autoFocus
          onChange={(event) => setCardTitle((_prevState) => event.target.value)}
        />
      )}

      <Flex data-testid="Flex">
        {!isEditing && (
          <AddCardText
            data-testid="AddCardText"
            onClick={() => setEditing(true)}
          >
            + Add a card
          </AddCardText>
        )}

        {isEditing && (
          <AddCardButton data-testid="AddCardButton" onClick={onCardCreate}>
            Add card
          </AddCardButton>
        )}

        {isEditing && (
          <CloseAddCardButton
            data-testid="CloseAddCardButton"
            secondary
            onClick={() => setEditing(false)}
          >
            X
          </CloseAddCardButton>
        )}
      </Flex>
    </ListContainer>
  );
}
