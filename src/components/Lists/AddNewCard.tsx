import { useState } from 'react';
import {
  AddCardButton,
  AddCardInput,
  AddCardText,
  CloseAddCardButton,
} from '~/components/Lists/List.styled';
import { useCreateCard } from '~/query/cards';
import { Flex } from '~/styles/Page.styled';

type AddNewCardProps = {
  listId: string;
};

export function AddNewCard({ listId }: AddNewCardProps) {
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const createCard = useCreateCard();

  function onCardCreate() {
    createCard({
      cardTitle: newCardTitle,
      listId,
    });
    setIsAddingCard(false);
    setNewCardTitle('');
  }

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
