import { Dialog } from 'radix-ui';
import { useState } from 'react';
import { IoMdList } from 'react-icons/io';
import * as cardStyles from '~/components/Cards/Card.css';
import { useGetCardById, useUpdateCard } from '~/db/cards/cards.query';
import * as pageStyles from '~/styles/Page.css';
import { useCurrentCardId } from '~/utils/useCurrentCardId';

export function CardDescription() {
  const cardId = useCurrentCardId();
  const { data } = useGetCardById({ id: cardId });
  const [isEditing, setEditing] = useState(false);
  const [description, setDescription] = useState('');
  const updateCard = useUpdateCard();

  const placeHolderText = 'Add a more detailed description...';

  function editDescription() {
    setEditing(true);
    setDescription(data?.cardDescription ?? '');
  }

  function saveDescription() {
    updateCard({
      cardId,
      cardTitle: data?.cardTitle ?? '',
      cardDescription: description ?? undefined,
      listId: data?.listId ?? '',
    });
    setEditing(false);
  }

  return (
    <div
      className={cardStyles.descriptionContainer}
      data-testid="DescriptionContainer"
    >
      <div
        className={cardStyles.descriptionHeadingRow}
        data-testid="DescriptionHeadingRow"
      >
        <div
          className={pageStyles.flex}
          data-testid="Flex"
          style={{ alignItems: 'center' }}
        >
          <IoMdList size={24} />

          <Dialog.Title
            className={cardStyles.descriptionTitle}
            data-testid="DescriptionTitle"
          >
            Description
          </Dialog.Title>
        </div>

        {data?.cardDescription && !isEditing && (
          <button
            type="button"
            className={cardStyles.editDescriptionButton}
            data-testid="EditDescriptionButton"
            onClick={editDescription}
          >
            Edit
          </button>
        )}
      </div>

      {data?.cardDescription && !isEditing && (
        <div
          className={cardStyles.cardDescriptionText}
          data-testid="CardDescriptionText"
        >
          {data?.cardDescription}
        </div>
      )}

      {!isEditing && !data?.cardDescription && (
        // biome-ignore lint/a11y/useSemanticElements: <style discrepency>
        <div
          role="button"
          tabIndex={0}
          className={cardStyles.descriptionPlaceholder}
          data-testid="DescriptionPlaceholder"
          onClick={editDescription}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              editDescription();
            }
          }}
        >
          {placeHolderText}
        </div>
      )}

      {isEditing && (
        <>
          <textarea
            className={cardStyles.descriptionInput}
            data-testid="DescriptionInput"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={placeHolderText}
          />

          <div className={pageStyles.flex} data-testid="Flex">
            <button
              type="button"
              className={cardStyles.saveDescriptionButton}
              data-testid="SaveDescriptionButton"
              onClick={saveDescription}
            >
              Save
            </button>

            <button
              type="button"
              className={cardStyles.closeDescriptionButton}
              data-testid="CloseDescriptionButton"
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
}
