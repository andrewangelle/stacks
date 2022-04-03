import { useState } from 'react';
import { BsCardHeading } from 'react-icons/bs';
import { useRecoilState } from 'recoil';

import { 
  CardModalChecklists, 
  CardModalDescription, 
  CreateChecklist,
  DeleteCardPopover 
} from '~/components';
import { 
  CardModalClose,
  CardModalContent,
  CardModalListName,
  CardModalOverlay,
  CardModalPortal,
  CardModalRoot,
  CardModalSiderContainer, 
  CardModalSiderTitle, 
  CardModalTitle, 
  CardModalTrigger, 
  EditCardTitleCancelButton, 
  EditCardTitleInput, 
  EditCardTitleSaveButton, 
  Flex, 
  ListCardContainer, 
  Padding, 
} from '~/styles';

import { ListCardType, tokenState, useUpdateCardMutation } from '~/store';


export function CardModal(
  props: ListCardType & {
    listId: string;
    listName: string;
  }
  ){
  const [token] = useRecoilState(tokenState);
  const [isEditingTitle, setEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(props.cardTitle);
  const [updateCard] = useUpdateCardMutation();
  
  function onSave(){
    updateCard({
      cardDescription: props.cardDescription,
      cardTitle: editedTitle,
      cardId: props.id,
      listId: props.listId,
      token: token?.access_token!,
      userId: token?.user.id!
    })
    setEditingTitle(false)

  }
  return (
    <CardModalRoot>
      <CardModalTrigger>
        <ListCardContainer>
          {props.cardTitle}
        </ListCardContainer>
      </CardModalTrigger>

      <CardModalPortal>
        <CardModalOverlay>
          <CardModalContent>
            <CardModalClose>X</CardModalClose>

            <Padding padding='15px'>
              <Flex >
                <BsCardHeading size={24} />

                {!isEditingTitle && (
                  <CardModalTitle 
                    onClick={() => {
                      setEditingTitle(true)
                    }}
                  >
                    {props.cardTitle}
                  </CardModalTitle>
                )}

                {isEditingTitle && (
                  <div style={{position: 'relative'}}>
                    <Flex>
                      <EditCardTitleInput
                        value={editedTitle}
                        onChange={event => setEditedTitle(prevState => event.target.value)}
                      />
                      <EditCardTitleSaveButton onClick={onSave}>
                        Save
                      </EditCardTitleSaveButton>
                      <EditCardTitleCancelButton 
                        secondary 
                        onClick={() => setEditingTitle(false)}
                      >
                        Cancel
                      </EditCardTitleCancelButton>
                    </Flex>
                  </div>
                  
                )}
              </Flex>

              <CardModalListName>{`in list ${props.listName}`}</CardModalListName>

              <CardModalDescription
                listId={props.listId}
                cardId={props.id}
                cardTitle={props.cardTitle}
                cardDescription={props.cardDescription}
              />

              <CardModalChecklists cardId={props.id} />

              <CardModalSiderContainer>
                <CardModalSiderTitle>
                  Add to card
                </CardModalSiderTitle>

                <CreateChecklist listId={props.listId} cardId={props.id} />

                <CardModalSiderTitle>
                  Actions
                </CardModalSiderTitle>

                <DeleteCardPopover {...props} />                
              </CardModalSiderContainer>

            </Padding>

          </CardModalContent>
        </CardModalOverlay>
      </CardModalPortal>
    </CardModalRoot>
  )
}