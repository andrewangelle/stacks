import { styled } from '@pigment-css/react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import * as Progress from '@radix-ui/react-progress';
import { fontFamily, red } from '~/components/Boards/Boards.styled';
import { AddCardInput } from '~/components/Lists/List.styled';
import { Button } from '~/styles/Page.styled';

const cardModalBreakpoint = '@media (max-width: 850px)';

export const CardModalActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 12px 0px 44px;
`;

export const CardModalSiderButton = styled.div`
  font-family: ${fontFamily};
  background: #091e420a;
  border-radius: 5px;
  padding: 12px;
  display: flex;
  cursor: pointer;
  white-space: nowrap;
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

export const DeleteChecklistPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const DeleteCardPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
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
`;
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
`;

export const ChecklistHeader = styled.div` 
  display: flex;
  justify-content: space-between;
`;

export const ChecklistProgressPercentage = styled.span`
  color: #5e6c84;
  font-size: 11px;
  width: 32px;
  margin-top: 12px;
`;

export const ChecklistProgressRoot = styled(Progress.Root)` 
  position: relative;
  overflow: hidden;
  background: #091e4214;
  border-radius: 99999px;
  height: 8px;
  width: 100%;
`;

export const ChecklistProgressIndicator = styled(Progress.Indicator)` 
  background-color: #5ba4cf;
  height: 100%;
  transition: width 660ms cubic-bezier(0.65, 0, 0.35, 1);
`;

type ChecklistCheckboxContainerProps = {
  isHovering: boolean;
};

export const ChecklistCheckboxContainer = styled(
  'div',
)<ChecklistCheckboxContainerProps>({
  padding: '10px 0px',
  position: 'relative',
  cursor: 'pointer',
  background: (props) => (props.isHovering ? 'rgb(223 225 230)' : undefined),
});

export const CheckboxRoot = styled(Checkbox.Root)({
  backgroundColor: (props) => (props.checked === true ? '#5ba4cf' : 'white'),
  width: 16,
  height: 16,
  position: 'relative',
});

export const CheckboxIndicator = styled(Checkbox.Indicator)` 
  color: white;
  width: 16;
  height: 16;
`;

type CheckboxLabelProps = {
  checked: boolean;
};

export const CheckboxLabel = styled('label')<CheckboxLabelProps>({
  margin: '0 0 0 8px',
  fontFamily: fontFamily,
  fontSize: '14px',
  textDecoration: (props) => (props.checked ? 'line-through' : 'none'),
});

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

export const CardModalBody = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(200px, 280px);
  gap: 0;
  align-items: start;

  ${cardModalBreakpoint} {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const CardModalMainColumn = styled.div`
  min-width: 0;
  border-right: 1px solid rgba(0, 0, 0, 0.2);

  ${cardModalBreakpoint} {
    padding-right: 0;
    border-right: none;
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
  max-width: 900px;
  width: 100%;
  margin: 0 30px;
  height: max-content;
  overflow: scroll;
  background: white;
  padding: 30;
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
  padding: 12px;
  cursor: pointer;
  background: white;
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
