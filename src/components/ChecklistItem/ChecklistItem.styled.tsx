import { styled } from '@pigment-css/react';
import * as Checkbox from '@radix-ui/react-checkbox';
import * as Popover from '@radix-ui/react-popover';
import { fontFamily, red } from '~/components/Boards/Boards.styled';
import { cardModalContentIndent } from '~/components/Cards/Card.styled';
import { Button } from '~/styles/Page.styled';
import { checklistProgressBlue } from '~/styles/tokens';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const AddChecklistItemButton = styled(Button)` 
  border: none;
  padding: 8px 10px;
  margin: 12px 0px 0px ${cardModalContentIndent};
`;

export const AddChecklistItemInput = styled.textarea` 
  height: 30px;
  width: 100%;
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

export const CheckboxIndicator = styled(Checkbox.Indicator)` 
  color: white;
`;

type CheckboxLabelProps = {
  checked: boolean;
};

export const CheckboxLabel = styled('label')<CheckboxLabelProps>({
  margin: 0,
  fontFamily: fontFamily,
  fontSize: '14px',
  width: '100%',
  cursor: 'pointer',
  textDecoration: (props) => (props.checked ? 'line-through' : 'none'),
});
export const DragChecklistItemShadow = styled.div<{
  height?: number;
  width?: number;
}>({
  height: ({ height }) => `${height ?? 0}px`,
  width: ({ width }) => `${width ?? 0}px`,
  background: 'rgba(0,0,0,0.1)',
  borderRadius: '5px',
});

export const EditChecklistItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 85%;
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
  display: 'flex',
  justifyContent: 'space-between',
  padding: '10px 5px 10px 0px',
  variants: [
    {
      props: { isHovering: true },
      style: {
        background: 'rgba(0,0,0,0.1)',
        cursor: 'pointer',
      },
    },
  ],
});

type ChecklistCheckboxContainerProps = {
  isHovering: boolean;
};

export const ChecklistCheckboxContainer = styled('div')({
  display: 'grid',
  gridTemplateColumns: checklistRowColumns,
  margin: '10px 0px',
  position: 'relative',
  cursor: 'pointer',
});

type CheckboxRootProps = {
  isEditing: boolean;
};

export const CheckboxRoot = styled(Checkbox.Root)<CheckboxRootProps>({
  width: '16px',
  height: '16px',
  verticalAlign: 'top',
  top: '11px',
  position: 'relative',
  cursor: 'pointer',
  variants: [
    {
      props: { checked: true },
      style: {
        backgroundColor: checklistProgressBlue,
        color: 'white',
        borderColor: checklistProgressBlue,
        borderBlockColor: checklistProgressBlue,
        borderRadius: '3px',
      },
    },
    {
      props: { isEditing: true },
      style: {
        top: '30px',
      },
    },
  ],
});

export const DeleteChecklistPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  height: 100%;

  &:hover {
    position: relative;
    background: rgba(0,0,0,0.3);
    border-radius: 4px 
  }
`;
