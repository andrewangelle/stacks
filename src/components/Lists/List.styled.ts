import { styled } from '@pigment-css/react';
import * as Popover from '@radix-ui/react-popover';
import { TiDelete } from 'react-icons/ti';
import { activityFieldStyles } from '~/components/Activity/Activity.styled';
import { fontFamily, PopoverClose } from '~/components/Boards/Boards.styled';
import { animationStyles } from '~/styles/animations';
import { Button } from '~/styles/Page.styled';
import { focusRingBlue } from '~/styles/tokens';

export const ListGridContainer = styled.div` 
  display: grid;
  grid-template-rows: 100% 1fr max-content;
  grid-template-columns: 100px 1fr max-content;
`;

export const ListContainer = styled.div` 
  background-color: #ebecf0;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  height: max-content;
  position: relative;
  white-space: normal;
  width: 275px;
  padding: 8px;
  margin: 0 15px;
  overflow: scroll;
`;

export const ListName = styled.div` 
  font-family: ${fontFamily};
  color: black;
  font-weight: 700;
  font-size: 14px;
`;

export const EditListNameInput = styled.input`
  border-radius: 8px;
  border: none;
  padding: 9px;
  box-shadow: 0 1px 0 #091e4240;
  font-weight: 600;
  position: relative;
  margin-bottom: 4px;
  font-size: 14px;
`;

export const AddListButton = styled.button({
  border: 'none',
  background: 'none',
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 14,
  color: 'white',
  letterSpacing: '0.05rem',
});

export const AddCardButton = styled(Button)` 
  margin: 0;
  padding: 8px;
`;

export const AddCardText = styled.button` 
  border: none;
  background: none;
  font-family: ${fontFamily};
  cursor: pointer;
  font-size: 14px;
  border-radius: 8px;
  padding: 8px;
  margin-top: 4px;
  width: 100%;
  text-align: left;
  
  &:hover {
    background-color: rgba(0, 0, 0, .3);
  }
`;

export const AddCardInput = styled.input` 
  border-radius: 8px;
  border: none;
  padding: 9px;
  box-shadow: 0 1px 0 #091e4240;
  margin: 4px 0px 8px;
  width: stretch;
`;

export const CloseAddCardButton = styled(Button)` 
  border: none;
  color: black;
  padding: 8px;
  background: none;
  cursor: pointer;
  margin: 0 8px;
  font-weight: 600;
  &:hover {
    background-color: rgba(0, 0, 0, .3);
  }
`;

export const ListCardContainer = styled.div` 
  position: relative;
  border-radius: 8px;
  background: #fff;
  font-family: ${fontFamily};
  font-size: 14px;
  padding: 8px;
  box-shadow: 0 1px 0 #091e4240;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
  box-sizing: border-box;
  width: 100%;
  min-width: 0;

  &[role='button'] {
    cursor: pointer;

    &:focus {
      outline: 2px solid ${focusRingBlue};
      outline-offset: -2px;
    }
  }
`;

export const ListCardSkeleton = styled(ListCardContainer)({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  ...animationStyles.pulse,
});

export const ListHeaderSkeletonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

export const ListCardsSkeletonRow = styled.div`
  display: flex;
  flex-direction: column;
`;

export const ListNameSkeleton = styled(ListCardSkeleton)`
  width: 125px;
   margin: 8px 0px 12px 8px;
`;

export const ListCountSkeleton = styled(ListCardSkeleton)`
  width: 20px;
   margin: 8px 0px 12px 8px;
`;

export const AddListButtonSkeleton = styled(ListCardSkeleton)`
  margin: 8px 0px 8px 8px;
  width: 75px;
`;

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
  font-weight: 600;
  margin: 4px;
  position: relative;
  &:hover {
    background: rgba(9, 30, 66, 0.2);
    border-radius: 4px;
  }
`;

export const DeleteListIcon = styled(TiDelete)` 
  position: relative;
  top: 1px;
  cursor: pointer;

  &:hover {
    background: rgba(0,0,0, 0.3);
    border-radius: 15px;
  }
`;

export const DottedLine = styled.div`
  position: relative;
  top: 3px;
  flex: 50%;
  width: 100%;
  height: 0;
  border-top: 2px dashed #b3b9c4;
`;

export const AddNewCardAtPositionContainer = styled.div`
  position: relative;
  min-height: 8px;
  height: auto;
  cursor: pointer;
`;

export const AddNewCardAtPositionPlus = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 12px;
  background: #fff;
  padding: 2px 6px 0px;
  color: rgba(0, 0, 0, 0.7);
  border-radius: 2px;
  box-shadow: 0.5px 0.5px 0.5px 0.5px #091e4240; 
  border: ${activityFieldStyles.border};
  border-radius: 5px;
  z-index: 1;
`;
