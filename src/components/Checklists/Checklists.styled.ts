import { styled } from '@pigment-css/react';
import { Popover, Progress } from 'radix-ui';
import { fontFamily } from '~/components/Boards/Boards.styled';
import {
  CardModalActionButton,
  CardModalTitle,
  cardModalContentIndent,
  EditCardTitleForm,
  EditCardTitleInput,
} from '~/components/Cards/Card.styled';
import { animationStyles } from '~/styles/animations';
import { Button, secondaryButtonStyles } from '~/styles/Page.styled';

const checklistRowColumns = `${cardModalContentIndent} minmax(0, 1fr)`;

export const ChecklistsContainer = styled.div`
  margin: 30px 12px 0px;
`;

export const ChecklistContainer = styled.div`
  margin: 30px 0px;
`;

export const ChecklistPopoverContent = styled(Popover.Content)` 
  width: 304px;
  border-radius: 8px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1;
  box-shadow: 0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F;
`;

export const ChecklistItemOptionsContent = styled(ChecklistPopoverContent)` 
  height: 130px;
  padding: 10px;
`;
export const ChecklistPopoverHeader = styled.div`
  font-weight: 600;
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

export const DeleteChecklistButton = styled(CardModalActionButton)`
  && {
    font-size: 14px;
  }
`;

export const ChecklistHeaderActions = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

export const ToggleCheckedItemsButton = styled(Button)({
  ...secondaryButtonStyles,
  color: 'rgba(9, 30, 66, 0.725)',
  border: '1px solid rgba(9, 30, 66, 0.2)',
  padding: '8px 10px',
  margin: 0,
  fontSize: '14px',
  flexShrink: 0,

  '&:hover:not(:disabled)': {
    color: secondaryButtonStyles.color,
  },
});

export const AllItemsCompleteMessage = styled.p`
  color: #5e6c84;
  font-size: 14px;
  margin: 8px 0 8px ${cardModalContentIndent};
`;

export const ChecklistHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
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
  min-width: 0;
  overflow-wrap: anywhere;
`;
export const EditChecklistTitleForm = styled(EditCardTitleForm)``;
export const EditChecklistTitleInput = styled(EditCardTitleInput)`
  font-size: 14px;
`;

export const ChecklistNameSkeletonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ChecklistNameSkeleton = styled.div({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '75px',
  height: '24px',
  borderRadius: '8px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const DeleteChecklistSkeleton = styled.div({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  width: '60px',
  height: '32px',
  borderRadius: '8px',
  flexShrink: 0,
  position: 'relative',
  ...animationStyles.pulse,
});

export const ChecklistProgressSkeleton = styled.div({
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
