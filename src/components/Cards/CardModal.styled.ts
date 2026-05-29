import { styled } from '@pigment-css/react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { AddCardInput } from '~/components/Lists/List.styled';
import { Button } from '~/styles/Page.styled';
import { focusRingBlue, red } from '~/styles/tokens';

const cardModalBreakpoint = '@media (max-width: 850px)';

export const CardModalActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 12px 0px 44px;
`;

export const CardModalActionButton = styled.div`
  font-family: ${fontFamily};
  background: #091e420a;
  border-radius: 5px;
  padding: 12px;
  display: flex;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background: rgba(0,0,0, 0.1);
  }
`;

export const CardModalSiderButtonText = styled.span` 
  font-family: ${fontFamily};
  font-size: 12px;
`;

export const CreateChecklistPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
`;

export const DeleteCardPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
`;

export const CardModalRoot = styled(Dialog.Root)``;
export const CardModalPortal = styled(Dialog.Portal)``;
export const CardModalOverlay = styled(Dialog.Overlay)` 
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

export const CardModalBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 8px minmax(200px, 280px);
  gap: 0;
  align-items: start;

  ${cardModalBreakpoint} {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const CardModalResizeHandle = styled.div`
  height: 100%;
  cursor: grab;
  touch-action: none;
  position: relative;
  user-select: none;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 100%;
    transform: translateX(-50%);
    background: rgba(0, 0, 0, 0.2);
  }

  &:hover::after {
    background: ${focusRingBlue}; 
    width: 4px;
  }

  ${cardModalBreakpoint} {
    display: none;
  }
`;

export const CardModalMainColumn = styled.div`
  min-width: 0;

  ${cardModalBreakpoint} {
    padding-right: 0;
  }
`;

export const CardModalActivityColumn = styled.div`
  min-width: 0;
  padding: 12px;
  background: #ebecf0;
  height: 100%;

  ${cardModalBreakpoint} {
    background: white;
  }
`;

export const CardModalContent = styled(Dialog.Content)`
  position: relative;
  font-family: ${fontFamily};
  min-width: 700px;
  max-width: 88%;
  max-height: 95%;
  width: 100%;
  margin: 0 30px;
  height: max-content;
  overflow: scroll;
  background: white;
  border-radius: 5px;

  ${cardModalBreakpoint} {
    min-width: unset;
    max-width: calc(100% - 60px);
  }
`;

export const CardModalTrigger = styled(Dialog.Trigger)` 
  border: none;
  padding: 0px;
  cursor: pointer;
  width: 100%;
`;

export const CardModalCloseContainer = styled.div` 
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-bottom: 1px solid rgba(0,0,0, 0.2);
  `;

export const CardModalClose = styled(Dialog.Close)` 
  border: none;
  right: 0;
  padding: 8px;

  cursor: pointer;
  background: white;
  margin: 4px 12px 4px 4px;

  &:hover {
    background: rgba(0,0,0, 0.1);
    border-radius: 5px;
  }
`;

export const CardModalTitleContainer = styled.div`
  display: flex;
  margin: 12px 12px 0px;
`;

export const CardModalTitle = styled(Dialog.Title)` 
  margin: 0 16px;
  font-size: 18px;
`;

export const CardModalListName = styled.div` 
  font-size: 14px;
  margin: 4px 12px 12px 20px;
 `;

export const DescriptionContainer = styled.div`
  margin: 30px 12px 0px;
`;

export const DescriptionPlaceholder = styled.div` 
  background: rgba(0,0,0, 0.03);
  height: 30px;
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
  width: 80%;
  margin-left: 40px;
  font-size: 14px;
  padding: 15px;
  border-radius: 5px;
  border: none;
  font-family: ${fontFamily};
`;

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

export const EditCardTitleInput = styled(AddCardInput)` 
  width: 60%;
  margin: 0px 8px;
`;

export const EditCardTitleSaveButton = styled(Button)` 
  margin: 0 4px 0 0;
`;

export const EditCardTitleCancelButton = styled(EditCardTitleSaveButton)` 
  border-color: ${red};
  color: ${red};
`;
