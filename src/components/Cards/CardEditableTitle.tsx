import { useState } from 'react';
import {
  CardModalTitle,
  CardModalTitleContainer,
  EditCardTitleForm,
  EditCardTitleInput,
} from '~/components/Cards/Card.styled';
import { CardCompletedIndicator } from '~/components/Cards/CardCompletedIndicator';
import { useGetCardById, useUpdateCard } from '~/db/cards/cards.query';
import { useCurrentCardId } from '~/utils/useCurrentCardId';
import { useOutsideClick } from '~/utils/useOutsideClick';

export function CardEditableTitle() {
  const id = useCurrentCardId();
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
      <CardCompletedIndicator cardId={id} circleSize="18px" />

      {!isEditingTitle && (
        <CardModalTitle
          data-testid="CardModalTitle"
          data-completed={card?.isCompleted ? '' : undefined}
          onClick={openEditTitle}
        >
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
