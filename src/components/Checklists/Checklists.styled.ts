import { styled } from '@pigment-css/react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import * as Progress from '@radix-ui/react-progress';
import { fontFamily, red } from '~/components/Boards/Boards.styled';
import { cardModalContentIndent } from '~/components/Cards/CardModal.styled';
import { Button } from '~/styles/Page.styled';
import { checklistProgressBlue } from '~/styles/tokens';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const ChecklistsContainer = styled.div`
  margin: 30px 12px 0px;
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
  border: none;
  padding: 8px 10px;
  color: black;
  margin: 0;

  &:hover {
    color: ${red}
  }
`;

export const AddChecklistItemButton = styled(Button)` 
  border: none;
  padding: 8px 10px;
  margin: 12px 0px 0px ${cardModalContentIndent};
`;

export const AddChecklistItemInput = styled.textarea` 
  height: 30px;
  width: 60%;
  font-size: 14px;
  padding: 15px;
  border-radius: 5px;
  margin: 8px 0px;
  border: none;
  font-family: ${fontFamily};
  background-color: rgba(0, 0, 0, 0.03);

  &:focus {
    background-color: #fff;
  }
`;

export const AddChecklistItemInputIndented = styled(AddChecklistItemInput)` 
  margin: 8px 0px 8px ${cardModalContentIndent};
`;

export const ChecklistItemActions = styled.div`
  display: flex;
`;

export const ChecklistItemActionsIndented = styled(ChecklistItemActions)`
  margin-left: ${cardModalContentIndent};
`;

export const AddChecklistButton = styled(Button)` 
  padding: 8px 10px;
  margin: 0 10px 0 0px;
`;

export const DeleteChecklistPopoverButton = styled(Button)` 
  background: ${red};
  width: 100%;
  margin: 15px 0px 0px;
  padding: 8px 10px;
`;

export const ChecklistHeader = styled.div` 
  display: flex;
  justify-content: space-between;
`;

export const ChecklistProgressRow = styled.div`
  display: grid;
  grid-template-columns: ${checklistRowColumns};
  align-items: flex-start;
  position: relative;
`;

export const ChecklistLeadingColumn = styled.div`
  display: flex;
  justify-content: flex-start;
`;

export const ChecklistContentColumn = styled.div`
  min-width: 0;
`;

export const ChecklistCheckboxContentColumn = styled(
  ChecklistContentColumn,
)<ChecklistCheckboxContainerProps>({
  position: 'relative',
  variants: [
    {
      props: { isHovering: true },
      style: {
        background: 'rgb(223 225 230)',
      },
    },
  ],
});

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
  margin: 15px 0;
`;

export const ChecklistProgressIndicator = styled(Progress.Indicator)` 
  background-color: ${checklistProgressBlue};
  height: 100%;
  transition: width 660ms cubic-bezier(0.65, 0, 0.35, 1);
`;

type ChecklistCheckboxContainerProps = {
  isHovering: boolean;
};

export const ChecklistCheckboxContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: checklistRowColumns,
  padding: '10px 0px',
  position: 'relative',
  cursor: 'pointer',
});

type CheckboxRootProps = {
  isEditing: boolean;
};

export const CheckboxRoot = styled(Checkbox.Root)<CheckboxRootProps>({
  width: '16px',
  height: '16px',
  borderColor: 'rgb(223 225, padding: 25 230)',
  verticalAlign: 'top',
  top: '2px',
  position: 'relative',
  variants: [
    {
      props: { checked: true },
      style: {
        backgroundColor: checklistProgressBlue,
      },
    },
    {
      props: { isEditing: true },
      style: {
        top: '10px',
      },
    },
  ],
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
  margin: 0,
  fontFamily: fontFamily,
  fontSize: '14px',
  textDecoration: (props) => (props.checked ? 'line-through' : 'none'),
});

export const DeleteChecklistPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
`;

export const DragChecklistItemShadow = styled.div<{
  height?: number;
  width?: number;
}>({
  height: ({ height }) => `${height ?? 0}px`,
  width: ({ width }) => `${width ?? 0}px`,
  background: 'rgba(0,0,0,0.1)',
  borderRadius: '5px',
});
