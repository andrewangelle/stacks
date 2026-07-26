import { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import * as listStyles from '~/components/Lists/List.css';
import { useCreateActivity } from '~/db/activity/activity.query';
import { useCreateCard } from '~/db/cards/cards.query';
import * as pageStyles from '~/styles/Page.css';
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
        <div className={listStyles.listCardSkeleton} />
      </div>
    );
  }

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: <style conflict>
    <div
      className={listStyles.addNewCardAtPositionContainer}
      data-testid={`AddNewCardAtPosition-${position}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {isAddingCard && (
        <div style={{ marginTop: '8px' }}>
          <input
            className={listStyles.addCardInput}
            data-testid="AddCardInput"
            value={newCardTitle}
            placeholder="Enter a title"
            onChange={(event) =>
              setNewCardTitle((_prevState) => event.target.value)
            }
          />
        </div>
      )}

      <div
        className={pageStyles.flex}
        data-testid="Flex"
        style={{ marginBottom: '8px' }}
      >
        {!isAddingCard && isHovering && (
          <>
            {/* biome-ignore lint/a11y/useSemanticElements: <style conflict> */}
            <div
              role="button"
              tabIndex={0}
              className={listStyles.addNewCardAtPositionPlus}
              data-testid="AddNewCardAtPositionPlus"
              onClick={() => setIsAddingCard(true)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setIsAddingCard(true);
                }
              }}
            >
              <FaPlus size={12} />
            </div>

            <div className={listStyles.dottedLine} />
          </>
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
