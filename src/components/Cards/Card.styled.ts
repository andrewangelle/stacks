import { styled } from '@pigment-css/react';
import * as Dialog from '@radix-ui/react-dialog';
import * as Popover from '@radix-ui/react-popover';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { Button, secondaryButtonStyles } from '~/styles/Page.styled';
import { focusRingBlue } from '~/styles/tokens';

const cardModalBreakpoint = '@media (max-width: 850px)';

/** Section icon width (description list icon, checklist icon, etc.). */
export const cardModalSectionIconSize = '24px';

/** Left edge of description body, checklist labels, inputs, and action rows (icon + 16px gap). */
export const cardModalContentIndent = '40px';

export const CardModalRoot = styled(Dialog.Root)``;
export const CardModalPortal = styled(Dialog.Portal)``;
export const CardModalOverlay = styled(Dialog.Overlay)` 
  background: rgba(0 0 0 / 0.8);
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
  grid-template-rows: minmax(0, 1fr);
  gap: 0;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;

  ${cardModalBreakpoint} {
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const CardActionsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 12px 0px 44px;
`;

export const CardModalActionButton = styled.div`
  font-family: ${fontFamily};
  background: #091e420a;
  border-radius: 8px;
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

export const ResizeableCardColumnHandle = styled.div`
  height: 100%;
  cursor: ew-resize;
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
    width: 1px;
  }

  &:hover::after {
    background: ${focusRingBlue}; 
    width: 2px;
  }

  ${cardModalBreakpoint} {
    display: none;
  }
`;

export const CardMainColumn = styled.div`
  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  ${cardModalBreakpoint} {
    padding-right: 0;
    flex-shrink: 0;
    min-height: unset;
    overflow: visible;
  }
`;

export const CardActivityColumn = styled.div`
  min-width: 0;
  min-height: 0;
  padding: 12px;
  background:rgb(248, 248, 248); 
  overflow-y: auto;
  padding: 0;

  ${cardModalBreakpoint} {
    background: white;
    flex-shrink: 0;
    min-height: unset;
    overflow: visible;
  }
`;

export const CardModalContent = styled(Dialog.Content)`
  position: relative;
  font-family: ${fontFamily};
  display: flex;
  flex-direction: column;
  max-width: 88vw;
  height: 95vh;
  width: 100%;
  margin: 0 30px;
  overflow: hidden;
  background: white;
  border-radius: 8px;

  ${cardModalBreakpoint} {
    min-width: unset;
    max-width: calc(100% - 30px);
    height: auto;
    max-height: 99vh;
  }
`;

export const CardModalTrigger = styled('div')({
  border: 'none',
  padding: '0px',
  cursor: 'pointer',
  width: '100%',
  minWidth: 0,
  boxSizing: 'border-box',
  borderRadius: '5px',
  textAlign: 'left',

  '&:focus': {
    outline: `2px solid ${focusRingBlue}`,
    outlineOffset: '-2px',
  },
});

export const CardModalCloseContainer = styled.div` 
  display: flex;
  flex-shrink: 0;
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
  }
`;

export const CardModalTitleContainer = styled.div`
  display: flex;
  margin: 12px 12px 0px;
`;

export const CardModalTitle = styled(Dialog.Title)({
  margin: '0 16px',
  fontSize: '20px',
  color: 'black',
  '&[data-completed]': {
    color: 'rgba(0,0,0, 0.5)',
  },
});

export const CardModalListName = styled.div` 
  font-size: 14px;
  margin: 4px 12px 12px 20px;
 `;

export const DescriptionContainer = styled.div`
  margin: 30px 12px 0px;
`;

export const DescriptionHeadingRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const DescriptionTitle = styled(CardModalTitle)`
  font-size: 14px;
`;

export const DescriptionPlaceholder = styled.div` 
  border: 1px solid rgba(0,0,0, 0.5);
  height: 30px;
  margin-left: ${cardModalContentIndent};
  font-size: 14px;
  padding: 15px;
  border-radius: 4px;
  cursor: pointer;
  color: rgba(0,0,0, 0.5);
  font-weight: 500;

  &:hover {
    background: rgba(0,0,0, 0.1);
  }
`;

export const DescriptionInput = styled.textarea` 
  height: 60px;
  width: 80%;
  margin-left: ${cardModalContentIndent};
  margin-bottom: 12px;
  font-size: 14px;
  padding: 15px;
  border-radius: 8px;
  border: none;
  font-family: ${fontFamily};
`;

export const SaveDescriptionButton = styled(Button)` 
  padding: 8px 10px;
  margin: 0 10px 0 ${cardModalContentIndent};
`;

export const CloseDescriptionButton = styled(Button)({
  ...secondaryButtonStyles,
  padding: '8px 10px',
  margin: 0,
  color: 'black',
  border: 'none',

  '&:hover:not(:disabled)': {
    color: secondaryButtonStyles.color,
  },
});

export const CardDescriptionText = styled.div` 
  font-family: ${fontFamily};
  margin-left: ${cardModalContentIndent};
  font-size: 14px;
  margin-top: 15px;
`;

export const EditDescriptionButton = styled(Button)({
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

export const EditCardTitleForm = styled.form`
  position: relative;
  top: -1px;
  left: -2px;
`;

export const EditCardTitleInput = styled.input` 
  border: none;
  margin: 0 16px;
  font-size: 20px;
  font-weight: 700;
  font-family: ${fontFamily};
`;
