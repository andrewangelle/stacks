import { Dialog, Popover } from 'radix-ui';
import { type DataAttributes, styled } from 'styled-components';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { richTextStyles } from '~/components/shared/RichText/RichText.styled';
import {
  Button,
  secondaryButtonColor,
  secondaryButtonStyles,
} from '~/styles/Page.styled';
import { focusRingBlue } from '~/styles/tokens';

/** Section icon width (description list icon, checklist icon, etc.). */
export const cardModalSectionIconSize = '24px';

/** Left edge of description body, checklist labels, inputs, and action rows (icon + 16px gap). */
export const cardModalContentIndent = '40px';

export const CardModalRoot = styled(Dialog.Root).attrs<DataAttributes>({
  'data-testid': 'CardModalRoot',
})``;
export const CardModalPortal = styled(Dialog.Portal).attrs<DataAttributes>({
  'data-testid': 'CardModalPortal',
})``;
export const CardModalOverlay = styled(Dialog.Overlay).attrs<DataAttributes>({
  'data-testid': 'CardModalOverlay',
})` 
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

export const CardModalBody = styled.div.attrs<DataAttributes>({
  'data-testid': 'CardModalBody',
})`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 8px minmax(200px, 280px);
  grid-template-rows: minmax(0, 1fr);
  gap: 0;
  align-items: stretch;
  flex: 1 1 auto;
  min-height: 0;
  overflow: hidden;

  @media (max-width: 850px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    overflow-y: auto;
    overflow-x: hidden;
  }
`;

export const CardActionsContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'CardActionsContainer',
})`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin: 12px 12px 0px 44px;
`;

type IsOpenProps = {
  $isOpen: boolean;
};
export const CardModalActionButton = styled.div<IsOpenProps>`

  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
  border: 1px solid rgba(9, 30, 66, 0.2);
  cursor: pointer;
  font-weight: 600;
  padding: 8px 10px;

  // applies hover effect to the button
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: '#000';
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:disabled {
    background: rgba(9, 30, 66, 0.02);
    color: rgba(9, 30, 66, 0.2);
    border: 1px solid rgba(9, 30, 66, 0.2);
    cursor: 'not-allowed';
  }


  &:hover {
    background: ${({ $isOpen }) => ($isOpen ? 'rgba(0, 0, 0, 0.8)' : 'rgba(9, 30, 66, 0.04)')};
    color: ${({ $isOpen }) => ($isOpen ? 'white' : 'rgba(9, 30, 66, 0.9)')};
  }

  color: ${({ $isOpen }) => ($isOpen ? 'white' : 'rgba(9, 30, 66, 0.9)')};
  background: ${({ $isOpen }) => ($isOpen ? 'rgba(0, 0, 0, 0.8)' : 'transparent')};
`;

export const CardModalSiderButtonText = styled.span.attrs<DataAttributes>({
  'data-testid': 'CardModalSiderButtonText',
})` 
  font-family: ${fontFamily};
  font-size: 14px;
`;

export const CreateChecklistPopoverTrigger = styled(
  Popover.Trigger,
).attrs<DataAttributes>({
  'data-testid': 'CreateChecklistPopoverTrigger',
})` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
`;

export const DeleteCardPopoverTrigger = styled(
  Popover.Trigger,
).attrs<DataAttributes>({
  'data-testid': 'DeleteCardPopoverTrigger',
})` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
`;

export const ResizeableCardColumnHandle = styled.div.attrs<DataAttributes>({
  'data-testid': 'ResizeableCardColumnHandle',
})`
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

  @media (max-width: 850px) {
    display: none;
  }
`;

export const CardMainColumn = styled.div.attrs<DataAttributes>({
  'data-testid': 'CardMainColumn',
})`
  min-width: 0;
  min-height: 0;
  overflow-y: auto;

  @media (max-width: 850px) {
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

  @media (max-width: 850px) {
    background: white;
    flex-shrink: 0;
    min-height: unset;
    overflow: visible;
  }
`;

export const CardPageActivityColumn = styled(CardActivityColumn)`
  background: transparent;

  @media (max-width: 850px) {
    background: transparent;
  }
`;

export const CardModalContent = styled(Dialog.Content).attrs<DataAttributes>({
  'data-testid': 'CardModalContent',
})`
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

  @media (max-width: 850px) {
    min-width: unset;
    max-width: calc(100% - 30px);
    height: auto;
    max-height: 99vh;
  }
`;

export const CardPageContent = styled(Dialog.Content).attrs<DataAttributes>({
  'data-testid': 'CardModalContent',
})`
  position: relative;
  font-family: ${fontFamily};
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding-top: 116px;
  background: rgb(248, 248, 248);
`;

export const CardModalTrigger = styled.div.attrs<DataAttributes>({
  'data-testid': 'CardModalTrigger',
})`
  border: none;
  padding: 0px;
  cursor: pointer;
  width: 100%;
  min-width: 0;
  box-sizing: border-box;
  border-radius: 5px;
  text-align: left;

  &:focus {
    outline: 2px solid ${focusRingBlue};
    outline-offset: -2px;
  }
`;

export const CardModalTitleContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'CardModalTitleContainer',
})`
  display: flex;
  margin: 12px 12px 0px;
`;

export const CardModalTitle = styled(Dialog.Title).attrs<DataAttributes>({
  'data-testid': 'CardModalTitle',
})`
  margin: 0 16px;
  font-size: 28px;
  color: black;

  &[data-completed] {
    color: rgba(0, 0, 0, 0.5);
  }
`;

export const CardModalHiddenTitle = styled(Dialog.Title)`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

export const CardModalListName = styled.div` 
  font-size: 14px;
  margin: 4px 12px 12px 20px;
 `;

export const DescriptionContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionContainer',
})`
  margin: 30px 12px 0px;
`;

export const DescriptionHeadingRow = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionHeadingRow',
})`
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const DescriptionTitle = styled(CardModalTitle).attrs<DataAttributes>({
  'data-testid': 'DescriptionTitle',
})`
  font-size: 14px;
`;

export const DescriptionPlaceholder = styled.div.attrs<DataAttributes>({
  'data-testid': 'DescriptionPlaceholder',
})` 
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

export const DescriptionEditorContainer = styled.div`
  margin: 0 12px 12px ${cardModalContentIndent};
`;

export const SaveDescriptionButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'SaveDescriptionButton',
})` 
  padding: 8px 10px;
  margin: 0 10px 0 ${cardModalContentIndent};
`;

export const CloseDescriptionButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'CloseDescriptionButton',
})`
  ${secondaryButtonStyles}
  padding: 8px 10px;
  margin: 0;
  color: black;
  border: none;

  &:hover:not(:disabled) {
    color: ${secondaryButtonColor};
  }
`;

export const CardDescriptionText = styled.div.attrs<DataAttributes>({
  'data-testid': 'CardDescriptionText',
})`
  ${richTextStyles}
  margin-left: ${cardModalContentIndent};
  margin-top: 15px;
  cursor: pointer;
`;

export const EditDescriptionButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'EditDescriptionButton',
})`
  ${secondaryButtonStyles}
  color: rgba(9, 30, 66, 0.725);
  border: 1px solid rgba(9, 30, 66, 0.2);
  padding: 8px 10px;
  margin: 0;
  font-size: 14px;
  flex-shrink: 0;

  &:hover:not(:disabled) {
    color: ${secondaryButtonColor};
  }
`;

export const EditCardTitleForm = styled.form`
  position: relative;
  top: -1px;
  left: -2px;
`;

export const EditCardTitleInput = styled.input.attrs<DataAttributes>({
  'data-testid': 'EditCardTitleInput',
})` 
  border: none;
  margin: 0 16px;
  font-size: 28px;
  font-weight: 700;
  font-family: ${fontFamily};
`;
