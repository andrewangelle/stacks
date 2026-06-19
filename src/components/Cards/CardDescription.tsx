import { useState } from 'react';
import * as Io from 'react-icons/io';
import {
  CardDescriptionText,
  CloseDescriptionButton,
  DescriptionContainer,
  DescriptionHeadingRow,
  DescriptionInput,
  DescriptionPlaceholder,
  DescriptionTitle,
  EditDescriptionButton,
  SaveDescriptionButton,
} from '~/components/Cards/Card.styled';
import { useGetCardById, useUpdateCard } from '~/db/cards/cards.query';
import { Flex } from '~/styles/Page.styled';
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
    <DescriptionContainer data-testid="DescriptionContainer">
      <DescriptionHeadingRow data-testid="DescriptionHeadingRow">
        <Flex data-testid="Flex" style={{ alignItems: 'center' }}>
          <Io.IoMdList size={24} />

          <DescriptionTitle data-testid="DescriptionTitle">
            Description
          </DescriptionTitle>
        </Flex>

        {data?.cardDescription && !isEditing && (
          <EditDescriptionButton
            data-testid="EditDescriptionButton"
            secondary
            onClick={editDescription}
          >
            Edit
          </EditDescriptionButton>
        )}
      </DescriptionHeadingRow>

      {data?.cardDescription && !isEditing && (
        <CardDescriptionText data-testid="CardDescriptionText">
          {data?.cardDescription}
        </CardDescriptionText>
      )}

      {!isEditing && !data?.cardDescription && (
        <DescriptionPlaceholder
          data-testid="DescriptionPlaceholder"
          onClick={editDescription}
        >
          {placeHolderText}
        </DescriptionPlaceholder>
      )}

      {isEditing && (
        <>
          <DescriptionInput
            data-testid="DescriptionInput"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={placeHolderText}
            autoFocus
          />

          <Flex data-testid="Flex">
            <SaveDescriptionButton
              data-testid="SaveDescriptionButton"
              onClick={saveDescription}
            >
              Save
            </SaveDescriptionButton>

            <CloseDescriptionButton
              data-testid="CloseDescriptionButton"
              secondary
              onClick={() => setEditing(false)}
            >
              Cancel
            </CloseDescriptionButton>
          </Flex>
        </>
      )}
    </DescriptionContainer>
  );
}
