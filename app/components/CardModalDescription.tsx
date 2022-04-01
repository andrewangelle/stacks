import { useState } from "react";
import { IoMdList } from "react-icons/io";
import { useRecoilState } from "recoil";

import { 
  Flex, 
} from "~/styles";

import { tokenState, useUpdateCardMutation } from "~/store";
import { DescriptionContainer, ModalTitle, EditDescriptionButton, CardDescriptionText, DescriptionPlaceholder, DescriptionInput, SaveDescriptionButton, CloseDescriptionButton } from ".";

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
}){
  const [token] = useRecoilState(tokenState)
  const [isEditing, setEditing] = useState(false);
  const [description, setDescription] = useState(cardDescription);
  const [updateCard] = useUpdateCardMutation();
  
  const placeHolderText = 'Add a more detailed description...';
  return (
    <DescriptionContainer>
      <Flex>
        <IoMdList size={24} />
        <ModalTitle>Description</ModalTitle>
        {cardDescription && !isEditing && (
          <EditDescriptionButton secondary onClick={() => setEditing(true)}>
            Edit
          </EditDescriptionButton>
        )}
      </Flex>

      {cardDescription && !isEditing && (
        <CardDescriptionText>
          {cardDescription}
        </CardDescriptionText>
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
            onChange={event => setDescription(event.target.value)}
            placeholder={placeHolderText}
          />
          <Flex>
            <SaveDescriptionButton
              onClick={() => {
                updateCard({
                  token: token?.access_token!,
                  userId: (token as any).user.id,
                  cardId,
                  cardTitle,
                  cardDescription: description,
                  listId
                });
                setEditing(false);
              }}
            >
              Save
            </SaveDescriptionButton>
            <CloseDescriptionButton 
              secondary 
              onClick={() => setEditing(false)}
            >
                X
            </CloseDescriptionButton>
          </Flex>
        </>
      )}
    </DescriptionContainer>
  )
}