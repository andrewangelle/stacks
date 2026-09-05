import { Popover } from 'radix-ui';
import { type DataAttributes, styled } from 'styled-components';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { Button } from '~/styles/Page.styled';
import { focusRingBlue } from '~/styles/tokens';

export const EditCardPopoverTriggerContainer = styled.button.attrs<DataAttributes>(
  {
    'data-testid': 'EditCardPopoverTrigger',
  },
)`
  position: absolute;
  top: 4px;
  right: 8px;
  display: flex;
  align-items: initial;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 1px solid rgba(9, 30, 66, 0.2);
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: rgba(9, 30, 66, 0.7);
  cursor: pointer;
  opacity: 0;
  transform: scale(0.8);
  transition: opacity 150ms ease, transform 150ms ease, background-color 150ms ease;
  z-index: 1;

  &:hover {
    background: rgba(9, 30, 66, 0.13);
    color: rgba(9, 30, 66, 0.9);
  }

  &:focus-visible {
    outline: 2px solid ${focusRingBlue};
    outline-offset: 1px;
    opacity: 1;
    transform: scale(1);
  }

  &[data-visible] {
    opacity: 1;
    transform: scale(1);
  }

  &[data-state='open'] {
    opacity: 0;
    pointer-events: none;
  }
  
  svg {
    margin-top: 6px;
    margin-left: 6px;
  }
`;

export const EditCardPopoverOverlay = styled.div.attrs<DataAttributes>({
  'data-testid': 'EditCardPopoverOverlay',
})`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 2;
`;

export const EditCardPopoverContent = styled(
  Popover.Content,
).attrs<DataAttributes>({
  'data-testid': 'EditCardPopoverContent',
})`
  display: flex;
  flex-direction: column;
  gap: 4px;
  z-index: 3;
  background: transparent;
  outline: none;
`;

export const EditCardPopoverHeader = styled.div.attrs<DataAttributes>({
  'data-testid': 'EditCardPopoverHeader',
})`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(9, 30, 66, .75);
  padding: 5px 10px 10px;
`;

export const EditCardPopoverBackButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'EditCardPopoverBackButton',
})`
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: rgba(9, 30, 66, 0.9);
  padding: 2px 6px;

  &:hover {
    background: rgba(9, 30, 66, 0.2);
  }
`;

export const EditCardTextareaContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'EditCardTextareaContainer',
})`
  background: #fff;
  border-radius: 8px;
  padding: 8px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

export const EditCardTitleTextarea = styled.textarea.attrs<DataAttributes>({
  'data-testid': 'EditCardTitleTextarea',
})`
  display: block;
  width: 100%;
  box-sizing: border-box;
  border: 2px solid ${focusRingBlue};
  border-radius: 4px;
  padding: 8px;
  font-family: ${fontFamily};
  font-size: 14px;
  line-height: 20px;
  resize: none;
  outline: none;
  min-height: 60px;

  &:focus {
    border-color: ${focusRingBlue};
  }
`;

export const EditCardSaveButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'EditCardSaveButton',
})`
  padding: 6px 12px;
  margin: 4px 0 0;
  font-weight: 600;
  align-self: flex-start;
`;

export const EditCardActionsContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'EditCardActionsContainer',
})`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const EditCardActionOption = styled.button.attrs<DataAttributes>({
  'data-testid': 'EditCardActionOption',
})`
  padding: 6px 12px;
  cursor: pointer;
  border: none;
  background: #fff;
  color: #172b4d;
  text-align: left;
  font-size: 14px;
  font-weight: 500;
  font-family: ${fontFamily};
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
  border-radius: 8px;
  box-shadow: 0px 1px 1px #091e4240;

  &:hover {
    background: #e4e7ec
  }

  &:active {
    background: #dcdfe4;
  }

  &[data-active] {
    background: rgba(0, 0, 0, 0.8);
    color: white;

    &:hover {
      background: rgba(0, 0, 0, 0.8);
      color: white;
    }
  }
`;

export const CopyLinkIconContainer = styled.span.attrs<DataAttributes>({
  'data-testid': 'CopyLinkIconContainer',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  transition: opacity 150ms ease, background-color 150ms ease;

  &[data-copied] {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #6A9A23;
    color: #fff;
  }
`;

export const MoveCardOptionWrapper = styled.div.attrs<DataAttributes>({
  'data-testid': 'MoveCardOptionWrapper',
})`
  position: relative;
`;

export const MoveCardViewPanel = styled.div.attrs<DataAttributes>({
  'data-testid': 'MoveCardViewPanel',
})`
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  width: 304px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0px 8px 12px #1e1f2126, 0px 0px 1px #1e1f214f;
  box-sizing: border-box;
  z-index: 1;
`;

export const MoveCardViewPanelHeader = styled.div.attrs<DataAttributes>({
  'data-testid': 'MoveCardViewPanelHeader',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  position: relative;
  font-weight: 600;
  font-size: 14px;
  color: rgba(9, 30, 66, 0.75);
`;

export const MoveCardCloseButton = styled.button.attrs<DataAttributes>({
  'data-testid': 'MoveCardCloseButton',
})`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 4px;
  color: rgba(9, 30, 66, 0.75);

  &:hover {
    background: rgba(9, 30, 66, 0.08);
  }
`;

export const MoveCardFormContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'MoveCardFormContainer',
})`
  padding: 0 10px 10px;
`;
