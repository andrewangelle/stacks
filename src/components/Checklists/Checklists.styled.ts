import { styled } from '@pigment-css/react';
import * as Popover from '@radix-ui/react-popover';
import * as Progress from '@radix-ui/react-progress';
import { fontFamily, red } from '~/components/Boards/Boards.styled';
import {
  CardModalTitle,
  cardModalContentIndent,
  EditCardTitleForm,
  EditCardTitleInput,
} from '~/components/Cards/Card.styled';
import { Button } from '~/styles/Page.styled';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const ChecklistsContainer = styled.div`
  margin: 30px 12px 0px;
`;

export const ChecklistContainer = styled.div`
  margin: 30px 0px;
`;

export const ChecklistPopoverContent = styled(Popover.Content)` 
  height: 227px;
  width: 304px;
  border: 2px solid rgba(9, 30, 66, 0.08);
  border-radius: 8px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1;
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
  border: 1px solid black;
  padding: 8px 10px;
  color: black;
  margin: 0;
  
  &:hover {
    color: ${red};
    border-radius: 8px;
  }
`;

export const ChecklistHeader = styled.div` 
  display: flex;
  justify-content: space-between;
`;

export const ChecklistProgressIndicator = styled(Progress.Indicator)` 
  height: 100%;
  transition: width 660ms cubic-bezier(0.65, 0, 0.35, 1);
`;

export const ChecklistProgressRoot = styled(Progress.Root)` 
  position: relative;
  overflow: hidden;
  background: #091e4214;
  border-radius: 99999px;
  height: 8px;
  width: 100%;
  margin: 15px 0;
`;

export const ChecklistProgressRow = styled.div`
  display: grid;
  grid-template-columns: ${checklistRowColumns};
  align-items: flex-start;
  position: relative;
`;

export const ChecklistProgressPercentage = styled.span`
  color: #5e6c84;
  font-size: 11px;
  width: 32px;
  margin-top: 12px;
`;

export const ChecklistTitle = styled(CardModalTitle)`
  font-size: 14px;
`;
export const EditChecklistTitleForm = styled(EditCardTitleForm)``;
export const EditChecklistTitleInput = styled(EditCardTitleInput)`
  font-size: 14px;
`;
