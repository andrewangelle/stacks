import { styled } from '@pigment-css/react';
import { Checkbox, Popover } from 'radix-ui';
import { AiOutlineEllipsis } from 'react-icons/ai';
import { fontFamily, red } from '~/components/Boards/Boards.styled';
import { cardModalContentIndent } from '~/components/Cards/Card.styled';
import { animationStyles } from '~/styles/animations';
import { Button, secondaryButtonStyles } from '~/styles/Page.styled';
import { blue } from '~/styles/tokens';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const AddChecklistItemButton = styled(Button)({
  ...secondaryButtonStyles,
  padding: '8px 10px',
  margin: `12px 0px 0px ${cardModalContentIndent}`,
  fontSize: '14px',
  color: 'rgba(9, 30, 66, 0.725)',
  border: '1px solid rgba(9, 30, 66, 0.2)',

  '&:hover:not(:disabled)': {
    color: secondaryButtonStyles.color,
  },
});
export const AddChecklistItemInput = styled.textarea` 
  height: 30px;
  width: 100%;
  font-size: 14px;
  padding: 15px;
  border-radius: 8px;
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
  width: '80%',
  cursor: 'pointer',
  textDecoration: (props) => (props.checked ? 'line-through' : 'none'),
  wordWrap: 'break-word',
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
  alignItems: 'center',
  padding: '8px',
  minHeight: '25px',
  variants: [
    {
      props: { isHovering: true },
      style: {
        background: 'rgba(0,0,0,0.1)',
        cursor: 'pointer',
        borderRadius: '8px',
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
  position: 'relative',
  cursor: 'pointer',
});

export const CheckboxRoot = styled(Checkbox.Root)({
  width: '16px',
  height: '16px',
  verticalAlign: 'top',
  top: '12px',
  position: 'relative',
  cursor: 'pointer',
  appearance: 'none',
  WebkitAppearance: 'none',
  padding: 0,
  margin: 0,
  backgroundColor: 'transparent',
  border: '2px solid rgba(9, 30, 66, 0.35)',
  borderRadius: '3px',
  variants: [
    {
      props: { checked: true },
      style: {
        backgroundColor: blue,
        color: 'white',
        borderColor: blue,
        borderBlockColor: blue,
        borderRadius: '3px',
      },
    },
  ],
  '&[data-editing]': {
    top: '30px',
  },
});

export const ChecklistItemOptionsPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  height: 100%;
  border: 1px solid rgba(0,0,0,0.2);
  border-radius: 100%; 
  &:hover {
    position: relative;
    background: rgba(0,0,0,0.1);
  }

  &[data-state='open'] {
    background: black;
  }
`;

export const DeleteChecklistPopoverTrigger = styled(Popover.Trigger)({
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  height: '100%',
});

export const ChecklistItemOptionsEllipsis = styled(AiOutlineEllipsis)({
  position: 'relative',
  top: '1px',
});

export const ChecklistItemSkeletonContainer = styled.div({});

export const CheckboxSkeleton = styled.div({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '18px',
  height: '10px',
  borderRadius: '2px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const ChecklistLabelSkeleton = styled.div({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '18px',
  height: '10px',
  borderRadius: '2px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const AddChecklistButtonSkeleton = styled.div({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '100%',
  height: '8px',
  borderRadius: '8px',
  flexShrink: 0,
  position: 'relative',
  margin: '12px 0',
  ...animationStyles.pulse,
});

export const ChecklistItemOptionsListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ChecklistItemOptionsListItem = styled.button`
  padding: 8px 10px;
  cursor: pointer;
  border: none;
  background: transparent;
  text-align: left;
  width: 100%;
  font-size: 14px;

  &:hover {
    background: rgba(0,0,0,0.05);
  }

  &:active {
    background: rgba(0,0,0,0.1);
  }
`;
