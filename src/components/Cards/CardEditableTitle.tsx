import { useEffect, useState } from 'react';
import * as Bs from 'react-icons/bs';
import {
  CardModalTitle,
  CardModalTitleContainer,
  EditCardTitleCancelButton,
  EditCardTitleInput,
  EditCardTitleSaveButton,
} from '~/components/Cards/Card.styled';
import { useGetCardById, useUpdateCard } from '~/query/cards';
import { Flex } from '~/styles/Page.styled';

type CardEditableTitleProps = {
  id: string;
};

export function CardEditableTitle({ id }: CardEditableTitleProps) {
  const [isEditingTitle, setEditingTitle] = useState(false);
  const { data: card } = useGetCardById({ id });
  const [editedTitle, setEditedTitle] = useState(card?.cardTitle ?? '');
  const updateCard = useUpdateCard();

  function onSave() {
    updateCard({
      cardDescription: card?.cardDescription ?? '',
      cardTitle: editedTitle,
      cardId: id,
      listId: card?.listId ?? '',
    });
    setEditingTitle(false);
  }

  useEffect(() => {
    if (card?.cardTitle && editedTitle === '') {
      setEditedTitle(card.cardTitle);
    }
  }, [card?.cardTitle, editedTitle]);

  return (
    <CardModalTitleContainer data-testid="CardModalTitleContainer">
      <Bs.BsCardHeading size={24} />

      {!isEditingTitle && (
        <CardModalTitle
          data-testid="CardModalTitle"
          onClick={() => {
            setEditingTitle(true);
          }}
        >
          {card?.cardTitle}
        </CardModalTitle>
      )}

      {isEditingTitle && (
        <div style={{ position: 'relative' }}>
          <Flex data-testid="Flex">
            <EditCardTitleInput
              data-testid="EditCardTitleInput"
              value={editedTitle}
              autoFocus
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
  );
}
