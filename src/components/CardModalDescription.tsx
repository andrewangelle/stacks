import { useAtom } from 'jotai';
import { useState } from 'react';
import { IoMdList } from 'react-icons/io';
import { tokenState } from '~/store/atoms';
import { useUpdateCardMutation } from '~/store/cardsApi';
import {
  CardDescriptionText,
  CardModalTitle,
  CloseDescriptionButton,
  DescriptionContainer,
  DescriptionInput,
  DescriptionPlaceholder,
  EditDescriptionButton,
  SaveDescriptionButton,
} from '~/styles/CardModal';
import { Flex } from '~/styles/Page';

export function CardModalDescription({
  listId,
  cardId,
  cardTitle,
  cardDescription,
}: {
  listId: string;
  cardId: string;
  cardTitle: string;
  cardDescription: string;
}) {
  const [token] = useAtom(tokenState);
  const [isEditing, setEditing] = useState(false);
  const [description, setDescription] = useState(cardDescription);
  const [updateCard] = useUpdateCardMutation();

  const placeHolderText = 'Add a more detailed description...';
  return (
    <DescriptionContainer>
      <Flex>
        <IoMdList size={24} />

        <CardModalTitle>Description</CardModalTitle>

        {cardDescription && !isEditing && (
          <EditDescriptionButton secondary onClick={() => setEditing(true)}>
            Edit
          </EditDescriptionButton>
        )}
      </Flex>

      {cardDescription && !isEditing && (
        <CardDescriptionText>{cardDescription}</CardDescriptionText>
      )}

      {!isEditing && !cardDescription && (
        <DescriptionPlaceholder onClick={() => setEditing(true)}>
          {placeHolderText}
        </DescriptionPlaceholder>
      )}

      {isEditing && (
        <>
          <DescriptionInput
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder={placeHolderText}
          />

          <Flex>
            <SaveDescriptionButton
              onClick={() => {
                updateCard({
                  token: token?.access_token ?? '',
                  userId: token?.user.id ?? '',
                  cardId,
                  cardTitle,
                  cardDescription: description,
                  listId,
                });
                setEditing(false);
              }}
            >
              Save
            </SaveDescriptionButton>

            <CloseDescriptionButton secondary onClick={() => setEditing(false)}>
              X
            </CloseDescriptionButton>
          </Flex>
        </>
      )}
    </DescriptionContainer>
  );
}
