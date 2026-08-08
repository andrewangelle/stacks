import { Popover } from 'radix-ui';
import { css, type DataAttributes, styled } from 'styled-components';
import { fontFamily, PopoverClose } from '~/components/Boards/Boards.styled';
import { Button } from '~/styles/Page.styled';
import { red } from '~/styles/tokens';

export const ListActionsPopoverTrigger = styled(
  Popover.Trigger,
).attrs<DataAttributes>({
  'data-testid': 'ListActionsPopoverTrigger',
})` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
  padding: 0;
`;

type IsOpenProps = {
  $isOpen: boolean;
};

export const ListActionsPopoverButton = styled.div.attrs<DataAttributes>({
  'data-testid': 'ListActionsPopoverButton',
})<IsOpenProps>`
  cursor: pointer;
  text-align: center;
  white-space: nowrap;
  border: none;
  border-radius: 8px;
  justify-content: center;
  align-self: center;
  margin: auto;
  padding: 0 10px 8px;
  font-weight: 600;
  display: flex;
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    border-radius: inherit;
    opacity: 0;
    pointer-events: none;
    background-color: #000;
    transition: opacity .15s;
    position: absolute;
    inset: 0;
  }

  &:disabled {
    background: rgba(9, 30, 66, 0.02);
    color: rgba(9, 30, 66, 0.2);
    border: 1px solid rgba(9, 30, 66, 0.2);
    cursor: not-allowed;
  }
  
  &:hover {
    background: ${({ $isOpen }) => ($isOpen ? 'rgba(0, 0, 0, 0.8)' : 'rgba(9, 30, 66, 0.2)')};
    color: ${({ $isOpen }) => ($isOpen ? 'white' : 'rgba(9, 30, 66, 0.9)')};
  }

  color: ${({ $isOpen }) => ($isOpen ? 'white' : 'rgba(9, 30, 66, 0.9)')};
  background: ${({ $isOpen }) => ($isOpen ? 'rgba(0, 0, 0, 0.8)' : 'transparent')};

`;

type IsActiveProps = {
  $isActive: boolean;
};

export const ListActionsPopoverButtonBack = styled.button<IsActiveProps>`
  border: none;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: 600;
  color: rgba(9, 30, 66, 0.9);
  background: transparent;

  ::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:hover {
    background: rgba(9, 30, 66, 0.2);
  }

  &:disabled {
    background: rgba(9, 30, 66, 0.02);
    color: rgba(9, 30, 66, 0.2);
    border: 1px solid rgba(9, 30, 66, 0.2);
    cursor: not-allowed;
  }

  ${({ $isActive }) =>
    $isActive
      ? css`
          cursor: pointer;
          :hover {
            background: rgba(9, 30, 66, 0.2);
          }
        `
      : css`
          cursor: default;
          :hover {
            background: transparent;
          }
        `}
  
`;

export const ListActionsPopoverButtonText = styled.span.attrs<DataAttributes>({
  'data-testid': 'ListActionsPopoverButtonText',
})`
  font-family: ${fontFamily};
  font-size: 14px;
`;

export const ListActionsPopoverHeader = styled.div.attrs<DataAttributes>({
  'data-testid': 'ListActionsPopoverHeader',
})`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(9, 30, 66, .75);
  padding: 5px 0px 10px 5px;
`;

export const ListActionsPopoverClose = styled(
  PopoverClose,
).attrs<DataAttributes>({
  'data-testid': 'ListActionsPopoverClose',
})`
  && {
    font-weight: 600;
    margin: 4px;
    position: relative;
  }
  &&:hover {
    background: rgba(9, 30, 66, 0.2);
    border-radius: 4px;
  }
`;

export const ListActionsOptionsContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'ListActionsOptionsContainer',
})`
  display: flex;
  flex-direction: column;
`;

export const ListActionsOption = styled.button.attrs<DataAttributes>({
  'data-testid': 'ListActionsOption',
})`
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

export const DeleteListButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'DeleteListButton',
})`
  background: ${red};
  width: 100%;
  margin: 15px 0px 0px;
  padding: 8px 10px;
`;

export const MoveListFieldsContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'MoveListFieldsContainer',
})`
  display: flex;
  flex-direction: column;
  padding-top: 8px;
`;

export const MoveListButton = styled(Button).attrs<DataAttributes>({
  'data-testid': 'MoveListButton',
})`
  width: calc(100% - 20px);
  margin: 8px 10px 0px;
  padding: 10px 20px;
  font-weight: 500;
`;
