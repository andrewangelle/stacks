import { useEffect, useState } from 'react';
import {
  AddCardButton,
  AddCardFooter,
  AddCardInput,
  AddCardText,
  CloseAddCardButton,
} from '~/components/Lists/List.styled';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useCreateCard } from '~/db/cards/cards.query';
import { Flex } from '~/styles/Page.styled';
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
      createActivity({
        boardId,
        cardId: response?.id,
        listId: response?.listId,
        type: 'feed',
        content: 'added this card',
      });
      reset();
    }
  }, [isSuccess, response, boardId, createActivity, reset]);

  return (
    <AddCardFooter data-editing={isAddingCard ? '' : undefined}>
      {isAddingCard && (
        <AddCardInput
          value={newCardTitle}
          placeholder="Enter a title"
          autoFocus
          onChange={(event) =>
            setNewCardTitle((_prevState) => event.target.value)
          }
        />
      )}

      <Flex>
        {!isAddingCard && (
          <AddCardText onClick={() => setIsAddingCard(true)}>
            + Add a card
          </AddCardText>
        )}

        {isAddingCard && (
          <AddCardButton onClick={onCardCreate}>Add card</AddCardButton>
        )}

        {isAddingCard && (
          <CloseAddCardButton $secondary onClick={() => setIsAddingCard(false)}>
            X
          </CloseAddCardButton>
        )}
      </Flex>
    </AddCardFooter>
  );
}
