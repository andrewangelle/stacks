import { useState } from 'react';
import * as Bs from 'react-icons/bs';
import {
  CardModalTitle,
  CardModalTitleContainer,
  EditCardTitleForm,
  EditCardTitleInput,
} from '~/components/Cards/Card.styled';
import { useGetCardById, useUpdateCard } from '~/query/cards';
import { useOutsideClick } from '~/utils/useOutsideClick';

type CardEditableTitleProps = {
  id: string;
};

export function CardEditableTitle({ id }: CardEditableTitleProps) {
  const [isEditingTitle, setEditingTitle] = useState(false);
  const { data: card } = useGetCardById({ id });
  const [editedTitle, setEditedTitle] = useState('');
  const updateCard = useUpdateCard();
  const outsideClickRef = useOutsideClick(
    onOutsideTitleEditClick,
    isEditingTitle,
  );

  function openEditTitle() {
    setEditingTitle(true);
    setEditedTitle(card?.cardTitle ?? '');
  }

  function onOutsideTitleEditClick() {
    setEditingTitle(false);

    if (editedTitle !== card?.cardTitle) {
      updateCard({
        cardDescription: card?.cardDescription ?? '',
        cardTitle: editedTitle,
        cardId: id,
        listId: card?.listId ?? '',
      });
    }
  }

  return (
    <CardModalTitleContainer data-testid="CardModalTitleContainer">
      <Bs.BsCardHeading size={24} />

      {!isEditingTitle && (
        <CardModalTitle data-testid="CardModalTitle" onClick={openEditTitle}>
          {card?.cardTitle}
        </CardModalTitle>
      )}

      {isEditingTitle && (
        <EditCardTitleForm ref={outsideClickRef}>
          <EditCardTitleInput
            data-testid="EditCardTitleInput"
            value={editedTitle}
            autoFocus
            onChange={(event) =>
              setEditedTitle((_prevState) => event.target.value)
            }
          />
        </EditCardTitleForm>
      )}
    </CardModalTitleContainer>
  );
}
