import { styled } from '@pigment-css/react';
import * as Popover from '@radix-ui/react-popover';
import { fontFamily, PopoverClose } from '~/components/Boards/Boards.styled';
import { Button } from '~/styles/Page.styled';
import { red } from '~/styles/tokens';

export const ListActionsPopoverTrigger = styled(Popover.Trigger)` 
  border: none;
  background: transparent;
  cursor: pointer;
  width: auto;
  padding: 0;
`;

type IsOpenProps = {
  isOpen: boolean;
};

export const ListActionsPopoverButton = styled.div<IsOpenProps>({
  border: 'none',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
  margin: 'auto',
  display: 'flex',
  alignSelf: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  fontWeight: 600,
  padding: '0px 10px 8px',

  // applies hover effect to the button
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: '#000',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.15s ease',
  },

  '&:disabled': {
    background: 'rgba(9, 30, 66, 0.02)',
    color: 'rgba(9, 30, 66, 0.2)',
    border: '1px solid rgba(9, 30, 66, 0.2)',
    cursor: 'not-allowed',
  },

  '&:hover': {
    background: (props) =>
      props.isOpen ? 'rgba(0, 0, 0, 0.8)' : 'rgba(9, 30, 66, 0.2)',
    color: (props) => (props.isOpen ? 'white' : 'rgba(9, 30, 66, 0.9)'),
  },

  color: (props) => (props.isOpen ? 'white' : 'rgba(9, 30, 66, 0.9)'),
  background: (props) => (props.isOpen ? 'rgba(0, 0, 0, 0.8)' : 'transparent'),
});

type IsActiveProps = {
  isActive: boolean;
};

export const ListActionsPopoverButtonBack = styled.button<IsActiveProps>({
  border: 'none',
  cursor: (props) => (props.isActive ? 'pointer' : 'default'),
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '4px',
  margin: 'auto',
  display: 'flex',
  alignSelf: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
  fontWeight: 600,

  // applies hover effect to the button
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: '#000',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.15s ease',
  },

  '&:disabled': {
    background: 'rgba(9, 30, 66, 0.02)',
    color: 'rgba(9, 30, 66, 0.2)',
    border: '1px solid rgba(9, 30, 66, 0.2)',
    cursor: 'not-allowed',
  },

  '&:hover': {
    background: (props) =>
      props.isActive ? 'rgba(9, 30, 66, 0.2)' : 'transparent',
    color: 'rgba(9, 30, 66, 0.9)',
  },

  color: 'rgba(9, 30, 66, 0.9)',
  background: 'transparent',
});

export const ListActionsPopoverButtonText = styled.span`
  font-family: ${fontFamily};
  font-size: 14px;
`;

export const ListActionsPopoverHeader = styled.div`
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: rgba(9, 30, 66, .75);
  padding: 5px 0px 10px 5px;
`;

export const ListActionsPopoverClose = styled(PopoverClose)`
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

export const ListActionsOptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListActionsOption = styled.button`
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

export const DeleteListButton = styled(Button)` 
  background: ${red};
  width: 100%;
  margin: 15px 0px 0px;
  padding: 8px 10px;
`;
