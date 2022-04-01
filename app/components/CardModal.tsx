import * as Dialog from '@radix-ui/react-dialog';
import styled from 'styled-components';
import { BsCardHeading } from 'react-icons/bs';

import { 
  CardModalChecklists, 
  CardModalDescription, 
  CreateChecklist, 
} from '~/components';
import { 
  Button, 
  CardModalSiderContainer, 
  CardModalSiderTitle, 
  Flex, 
  fontFamily, 
  ListCardContainer, 
  Padding 
} from '~/styles';

import { ListCardType } from '~/store';

const Overlay = styled(Dialog.Overlay)` 
  background: rgba(0 0 0 / 0.5);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  place-items: center;
  overflow-y: auto;
  z-index: 2;
`;

const ModalContent = styled(Dialog.Content)` 
  position: relative;
  font-family: ${fontFamily};
  min-width: 700px;
  min-height: 500px;
  max-height: 700px;
  height: max-content;
  overflow: scroll;
  background: #ebecf0;
  padding: 30;
  border-radius: 5px;
`;

const ModalTrigger = styled(Dialog.Trigger)` 
  border: none;
  padding: none;
  cursor: pointer;
  width: 100%;
`;

export const ModalClose = styled(Dialog.Close)` 
  border: none;
  position: absolute;
  right: 0;
  padding: 16px;
  cursor: pointer;
`

export const ModalTitle = styled(Dialog.Title)` 
  margin: 0 16px;
  font-size: 18px;
`;

export const ListName = styled.div` 
  font-size: 14px;
  margin-left: 40px;
`;

export const DescriptionContainer = styled.div` 
  margin-top: 30px;
`;


export const DescriptionPlaceholder = styled.div` 
  background: rgba(0,0,0, 0.03);
  height: 30px;
  width: 60%;
  margin-left: 40px;
  font-size: 14px;
  padding: 15px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background: rgba(0,0,0, 0.1);
  }
`;

export const DescriptionInput = styled.textarea` 
  height: 60px;
  width: 60%;
  margin-left: 40px;
  font-size: 14px;
  padding: 15px;
  border-radius: 5px;
  border: none;
  font-family: ${fontFamily};
`

export const SaveDescriptionButton = styled(Button)` 
  padding: 8px 10px;
  margin: 0 10px 0 40px;
`;

export const CloseDescriptionButton = styled(Button)`
  padding: 8px 10px;
  margin: 0;
  border: none;
  color: black;
`;

export const CardDescriptionText = styled.div` 
  font-family: ${fontFamily};
  margin-left: 40px;
  font-size: 14px;
  margin-top: 15px;
`;

export const EditDescriptionButton = styled(Button)` 
  border: none;
  padding: 8px 10px;
  color: black;
  margin: -4px 0px 0px 0px;
`;


export function CardModal(
  props: ListCardType & {
    listId: string;
    listName: string;
  }
  ){
  return (
    <Dialog.Root>
      <ModalTrigger>
        <ListCardContainer>
          {props.cardTitle}
        </ListCardContainer>
      </ModalTrigger>

      <Dialog.Portal>
        <Overlay>
          <ModalContent>
            <ModalClose>X</ModalClose>

            <Padding padding='15px'>
              <Flex>
                <BsCardHeading size={24} />
                <ModalTitle>{props.cardTitle}</ModalTitle>
              </Flex>

              <ListName>{`in list ${props.listName}`}</ListName>

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

                <CreateChecklist cardId={props.id} />
              </CardModalSiderContainer>

            </Padding>

          </ModalContent>
        </Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  )
}