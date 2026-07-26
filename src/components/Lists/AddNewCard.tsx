import { useEffect, useState } from 'react';
import * as listStyles from '~/components/Lists/List.css';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useCreateCard } from '~/db/cards/cards.query';
import * as pageStyles from '~/styles/Page.css';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type AddNewCardProps = {
  listId: string;
};

export function AddNewCard({ listId }: AddNewCardProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const {
    mutate: createCard,
    isSuccess,
    data: response,
    reset,
  } = useCreateCard();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  function onCardCreate() {
    createCard({
      cardTitle: newCardTitle,
      listId,
    });
    setIsAddingCard(false);
    setNewCardTitle('');
  }

  useEffect(() => {
    if (isSuccess) {
      const card = response.data[0];
      createActivity({
        boardId,
        cardId: card.id,
        listId: card.listId,
        type: 'feed',
        content: 'added this card',
      });
      reset();
    }
  }, [isSuccess, response, boardId, createActivity, reset]);

  return (
    <div
      className={listStyles.addCardFooter}
      data-testid="AddCardFooter"
      data-editing={isAddingCard ? '' : undefined}
    >
      {isAddingCard && (
        <input
          className={listStyles.addCardInput}
          data-testid="AddCardInput"
          value={newCardTitle}
          placeholder="Enter a title"
          onChange={(event) =>
            setNewCardTitle((_prevState) => event.target.value)
          }
        />
      )}

      <div className={pageStyles.flex} data-testid="Flex">
        {!isAddingCard && (
          <button
            type="button"
            className={listStyles.addCardText}
            data-testid="AddCardText"
            onClick={() => setIsAddingCard(true)}
          >
            + Add a card
          </button>
        )}

        {isAddingCard && (
          <button
            type="button"
            className={listStyles.addCardButton}
            data-testid="AddCardButton"
            onClick={onCardCreate}
          >
            Add card
          </button>
        )}

        {isAddingCard && (
          <button
            type="button"
            className={listStyles.closeAddCardButton}
            data-testid="CloseAddCardButton"
            onClick={() => setIsAddingCard(false)}
          >
            X
          </button>
        )}
      </div>
    </div>
  );
}
