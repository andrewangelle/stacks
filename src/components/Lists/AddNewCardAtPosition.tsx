import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import {
  AddCardButton,
  AddCardInput,
  AddNewCardAtPositionContainer,
  AddNewCardAtPositionPlus,
  CloseAddCardButton,
  DottedLine,
  ListCardSkeleton,
} from '~/components/Lists/List.styled';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useCreateCard } from '~/db/cards/cards.query';
import { Flex } from '~/styles/Page.styled';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type AddNewCardAtPositionProps = {
  listId: string;
  position: number;
};

export function AddNewCardAtPosition({
  listId,
  position,
}: AddNewCardAtPositionProps) {
  const [isHovering, setIsHovering] = useState(false);
  const [isAddingCard, setIsAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const {
    mutate: createCard,
    isSuccess,
    isPending,
    data: response,
    reset,
  } = useCreateCard();
  const createActivity = useCreateActivity();
  const boardId = useCurrentBoardId();

  function onCardCreate() {
    createCard({
      cardTitle: newCardTitle,
      listId,
      position: position + 1,
    });
    setIsAddingCard(false);
    setNewCardTitle('');
    setIsHovering(false);
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

  if (isPending) {
    return (
      <div style={{ margin: '8px 0px' }}>
        <ListCardSkeleton />
      </div>
    );
  }

  return (
    <AddNewCardAtPositionContainer
      data-testid={`AddNewCardAtPosition-${position}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isAddingCard && (
        <div style={{ marginTop: '8px' }}>
          <AddCardInput
            data-testid="AddCardInput"
            value={newCardTitle}
            placeholder="Enter a title"
            autoFocus
            onChange={(event) =>
              setNewCardTitle((_prevState) => event.target.value)
            }
          />
        </div>
      )}

      <Flex data-testid="Flex" style={{ marginBottom: '8px' }}>
        {!isAddingCard && isHovering && (
          <>
            <AddNewCardAtPositionPlus
              data-testid="AddNewCardAtPositionPlus"
              onClick={() => setIsAddingCard(true)}
            >
              <FaPlus size={12} />
            </AddNewCardAtPositionPlus>

            <DottedLine />
          </>
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
    </AddNewCardAtPositionContainer>
  );
}
