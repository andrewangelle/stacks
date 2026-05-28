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
} from '~/components/Cards/CardModal.styled';
import { useUpdateCardMutation } from '~/query/cards';
import { Flex } from '~/styles/Page.styled';

type CardModalDescriptionProps = {
  listId: string;
  cardId: string;
  cardTitle: string;
  cardDescription: string;
};

export function CardModalDescription({
  listId,
  cardId,
  cardTitle,
  cardDescription,
}: CardModalDescriptionProps) {
  const [isEditing, setEditing] = useState(false);
  const [description, setDescription] = useState(cardDescription);
  const updateCard = useUpdateCardMutation();

  const placeHolderText = 'Add a more detailed description...';
  return (
    <DescriptionContainer data-testid="DescriptionContainer">
      <Flex data-testid="Flex">
        <Io.IoMdList size={24} />

        <CardModalTitle data-testid="CardModalTitle">
          Description
        </CardModalTitle>

        {cardDescription && !isEditing && (
          <EditDescriptionButton
            data-testid="EditDescriptionButton"
            secondary
            onClick={() => setEditing(true)}
          >
            Edit
          </EditDescriptionButton>
        )}
      </Flex>

      {cardDescription && !isEditing && (
        <CardDescriptionText data-testid="CardDescriptionText">
          {cardDescription}
        </CardDescriptionText>
      )}

      {!isEditing && !cardDescription && (
        <DescriptionPlaceholder
          data-testid="DescriptionPlaceholder"
          onClick={() => setEditing(true)}
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
              onClick={() => {
                updateCard({
                  id: cardId,
                  cardTitle,
                  cardDescription: description,
                  listId,
                });
                setEditing(false);
              }}
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
