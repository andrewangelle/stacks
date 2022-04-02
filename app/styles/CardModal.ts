import styled from 'styled-components';
import * as Popover from '@radix-ui/react-popover';
import * as Progress from '@radix-ui/react-progress';
import * as Checkbox from '@radix-ui/react-checkbox';

import { fontFamily, darkGray, Button } from '~/styles';

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
`