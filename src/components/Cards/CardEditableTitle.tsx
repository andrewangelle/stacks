import { Dialog } from 'radix-ui';
import { useState } from 'react';
import * as styles from '~/components/Cards/Card.css';
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
    <div
      className={styles.cardModalTitleContainer}
      data-testid="CardModalTitleContainer"
    >
      <CardCompletedIndicator cardId={id} circleSize="18px" />

      {!isEditingTitle && (
        <Dialog.Title
          className={styles.cardModalTitle}
          data-testid="CardModalTitle"
          data-completed={card?.isCompleted ? '' : undefined}
          onClick={openEditTitle}
        >
          {card?.cardTitle}
        </Dialog.Title>
      )}

      {isEditingTitle && (
        <form className={styles.editCardTitleForm} ref={outsideClickRef}>
          <input
            className={styles.editCardTitleInput}
            data-testid="EditCardTitleInput"
            value={editedTitle}
            onChange={(event) =>
              setEditedTitle((_prevState) => event.target.value)
            }
          />
        </form>
      )}
    </div>
  );
}
