import { useState } from 'react';
import * as Io from 'react-icons/io';
import {
  CardDescriptionText,
  CardModalTitle,
  CloseDescriptionButton,
  DescriptionContainer,
  DescriptionInput,
  DescriptionPlaceholder,
  EditDescriptionButton,
  SaveDescriptionButton,
} from '~/components/Cards/Card.styled';
import { useGetCardById, useUpdateCard } from '~/query/cards';
import { Flex } from '~/styles/Page.styled';

type CardModalDescriptionProps = {
  cardId: string;
};

export function CardDescription({ cardId }: CardModalDescriptionProps) {
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
      cardDescription: description,
      listId: data?.listId ?? '',
    });
    setEditing(false);
  }

  return (
    <DescriptionContainer data-testid="DescriptionContainer">
      <Flex data-testid="Flex">
        <Io.IoMdList size={24} />

        <CardModalTitle data-testid="CardModalTitle">
          Description
        </CardModalTitle>

        {data?.cardDescription && !isEditing && (
          <EditDescriptionButton
            data-testid="EditDescriptionButton"
            secondary
            onClick={editDescription}
          >
            Edit
          </EditDescriptionButton>
        )}
      </Flex>

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
              X
            </CloseDescriptionButton>
          </Flex>
        </>
      )}
    </DescriptionContainer>
  );
}
