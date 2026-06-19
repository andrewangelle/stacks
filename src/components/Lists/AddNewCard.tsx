import { useEffect, useState } from 'react';
import {
  AddCardButton,
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
    <>
      {isAddingCard && (
        <AddCardInput
          data-testid="AddCardInput"
          value={newCardTitle}
          placeholder="Enter a title"
          autoFocus
          onChange={(event) =>
            setNewCardTitle((_prevState) => event.target.value)
          }
        />
      )}

      <Flex data-testid="Flex">
        {!isAddingCard && (
          <AddCardText
            data-testid="AddCardText"
            onClick={() => setIsAddingCard(true)}
          >
            + Add a card
          </AddCardText>
        )}

        {isAddingCard && (
          <AddCardButton data-testid="AddCardButton" onClick={onCardCreate}>
            Add card
          </AddCardButton>
        )}

        {isAddingCard && (
          <CloseAddCardButton
            data-testid="CloseAddCardButton"
            secondary
            onClick={() => setIsAddingCard(false)}
          >
            X
          </CloseAddCardButton>
        )}
      </Flex>
    </>
  );
}
