import styled from 'styled-components';
import * as Popover from '@radix-ui/react-popover';
import * as Progress from '@radix-ui/react-progress';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';

import { fontFamily, darkGray, Button, AddCardInput, red } from '~/styles';

export const CardModalSiderContainer = styled.div` 
  position: absolute;
  right: 15px;
  width: 200px;
  top: 80px;
`

export const CardModalSiderTitle = styled.div` 
  font-family: ${fontFamily};
  font-size: 14px;
  color: ${darkGray};
  padding: 8px 10px;
  font-weight: 600;
`

export const CardModalSiderButton = styled.div` 
  font-family: ${fontFamily};
  background: #091e420a;
  border-radius: 5px;
  padding: 12px;
  display: flex;
  cursor: pointer;
`;

export const CardModalSiderButtonText = styled.span` 
  font-family: ${fontFamily};
  font-size: 12px;
`;

export const CreateChecklistPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
`;

export const DeleteChecklistPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const DeleteCardPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: 100%;
`;

export const ChecklistPopoverContent = styled(Popover.Content)` 
  height: 227px;
  width: 304px;
  border: 2px solid rgba(9, 30, 66, 0.08);
  border-radius: 5px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

export const DeleteChecklistPopoverContent = styled(ChecklistPopoverContent)` 
  height: 130px;
  padding: 10px;
`
export const ChecklistPopoverHeader = styled.div` 
  display: flex;
  justify-content: center;
  color: rgba(9, 30, 66, .75);
  padding: 10px;
`;

export const CreateChecklistTitle = styled.div` 
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 700;
  color: rgba(9, 30, 66, .75);
  padding: 10px;
`;

export const CreateChecklistInput = styled.input` 
  padding: 8px 12px;
  border: none;
  box-shadow: inset 0 0 0 2px #dfe1e6;
  background-color: #fafbfc;
  margin: 8px;
  width: initial;
`;

export const CreateChecklistAddButton = styled(Button)` 
  padding: 10px 20px;
  align-self: flex-start;
  margin: 8px;
`;

export const DeleteChecklistButton = styled(Button)` 
  border: none;
  padding: 8px 10px;
  color: black;
  margin: 0;
`;

export const AddChecklistItemButton = styled(Button)` 
border: none;
padding: 8px 10px;
color: black;
margin: 0;
`;


export const AddChecklistItemInput = styled.textarea` 
  height: 30px;
  width: 60%;
  font-size: 14px;
  padding: 15px;
  border-radius: 5px;
  border: none;
  font-family: ${fontFamily};
`;

export const AddChecklistButton = styled(Button)` 
  padding: 8px 10px;
  margin: 0 10px 0 0px;
`;

export const DeleteChecklistPopoverButton = styled(Button)` 
  background: #b04632;
  width: 100%;
  margin: 15px 0px 0px;
  padding: 8px 10px;
`

export const ChecklistHeader = styled.div` 
  display: flex;
  justify-content: space-between;
  width: 70%;
`;

export const ChecklistProgressPercentage = styled.span`
  color: #5e6c84;
  font-size: 11px;
  width: 32px;
  margin-top: 10px;
`;

export const ChecklistProgressRoot = styled(Progress.Root)` 
  position: relative;
  overflow: hidden;
  background: #091e4214;
  border-radius: 99999px;
  width: 60%;
  height: 8px;
`;

export const ChecklistProgressIndicator = styled(Progress.Indicator)` 
  background-color: #5ba4cf;
  height: 100%;
  transition: width 660ms cubic-bezier(0.65, 0, 0.35, 1);
`;

export const ChecklistCheckboxContainer = styled.div<{isHovering: boolean;}>` 
  padding: 10px 0px;
  width: 70%;
  position: relative;
  cursor: pointer;
  ${props => {
    if(props.isHovering){
      return `background: rgb(223 225 230);`
    }
  }}
`;

export const CheckboxRoot = styled(Checkbox.Root)<{checked: boolean}>` 
  background-color: ${props => props.checked ? '#5ba4cf' : 'white'};
  width: 16;
  height: 16;
  position: relative;
`;

export const CheckboxIndicator = styled(Checkbox.Indicator)` 
  color: white;
  width: 16;
  height: 16;
`

export const CheckboxLabel = styled.label<{checked: boolean}>` 
  margin: 0 0 0 8px;
  font-family: ${fontFamily};
  font-size: 14px;
  ${props => {
    if(props.checked){
      return `text-decoration: line-through;`
    }
  }}
`;


// Card Modal Styles

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

export const CardModalContent = styled(Dialog.Content)` 
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

export const CardModalTrigger = styled(Dialog.Trigger)` 
  border: none;
  padding: none;
  cursor: pointer;
  width: 100%;
`;

export const CardModalClose = styled(Dialog.Close)` 
  border: none;
  position: absolute;
  right: 0;
  padding: 16px;
  cursor: pointer;
`

export const CardModalTitle = styled(Dialog.Title)` 
  margin: 0 16px;
  font-size: 18px;
`;

export const CardModalListName = styled.div` 
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
`