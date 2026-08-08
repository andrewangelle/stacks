import { Popover } from 'radix-ui';
import { type DataAttributes, styled } from 'styled-components';
import {
  CreateBoardBackgroundChoice,
  fontFamily,
  PopoverClose,
} from '~/components/Boards/Boards.styled';

export const BoardMenuPopoverTrigger = styled(
  Popover.Trigger,
).attrs<DataAttributes>({
  'data-testid': 'BoardMenuPopoverTrigger',
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

export const BoardMenuPopoverButton = styled.div.attrs<DataAttributes>({
  'data-testid': 'BoardMenuPopoverButton',
})<IsOpenProps>`
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  white-space: nowrap;
  font-weight: 600;
  padding: 0px 10px 8px;

  // applies hover effect to the button
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
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

export const BoardMenuPopoverButtonBack = styled.button<IsActiveProps>`
  border: none;
  cursor: pointer;
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

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:disabled {
    background: rgba(9, 30, 66, 0.02);
    color: rgba(9, 30, 66, 0.2);
    border: 1px solid rgba(9, 30, 66, 0.2);
    cursor: not-allowed;
  }
  
  &:hover {
    background: ${({ $isActive }) => ($isActive ? 'rgba(9, 30, 66, 0.2)' : 'transparent')};
    color: ${({ $isActive }) => ($isActive ? 'rgba(9, 30, 66, 0.9)' : 'rgba(9, 30, 66, 0.9)')};
  }

  color: ${({ $isActive }) => ($isActive ? 'rgba(9, 30, 66, 0.9)' : 'rgba(9, 30, 66, 0.9)')};
  background: ${({ $isActive }) => ($isActive ? 'rgba(9, 30, 66, 0.2)' : 'transparent')};

`;

export const BoardMenuPopoverButtonText = styled.span.attrs<DataAttributes>({
  'data-testid': 'BoardMenuPopoverButtonText',
})`
  font-family: ${fontFamily};
  font-size: 14px;
  color: white;
`;

export const BoardMenuPopoverHeader = styled.div.attrs<DataAttributes>({
  'data-testid': 'BoardMenuPopoverHeader',
})`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(9, 30, 66, .75);
  padding: 5px 0px 10px 5px;
`;

export const BoardMenuPopoverClose = styled(PopoverClose).attrs<DataAttributes>(
  {
    'data-testid': 'BoardMenuPopoverClose',
  },
)`
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

export const BoardMenuOptionsContainer = styled.div.attrs<DataAttributes>({
  'data-testid': 'BoardMenuOptionsContainer',
})`
  display: flex;
  flex-direction: column;
`;

export const BoardMenuOption = styled.button.attrs<DataAttributes>({
  'data-testid': 'BoardMenuOption',
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

export const ChangeBoardBackgroundChoice = styled(
  CreateBoardBackgroundChoice,
).attrs<DataAttributes>({
  'data-testid': 'ChangeBoardBackgroundChoice',
})`
  && {
    height: 86px;
    width: 91px;
    cursor: pointer;
  }
`;

export const BoardMenuTriggerLoaderSlot = styled.span.attrs<DataAttributes>({
  'data-testid': 'BoardMenuTriggerLoaderSlot',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 33px;
`;
