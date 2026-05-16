import { styled } from '@pigment-css/react';
import { fontFamily } from '~/styles/Boards';
import { Button } from '~/styles/Page';

type AddListContainerProps = {
  isEditing: boolean;
};

export const AddListContainer = styled('div')<AddListContainerProps>({
  position: 'relative',
  fontFamily: fontFamily,
  backgroundColor: 'rgba(255, 255, 255, .3)',
  padding: '12px 16px',
  width: '225px',
  borderRadius: '5px',
  color: '#fff',
  cursor: 'pointer',
  variants: [
    {
      props: { isEditing: true },
      style: { height: 'max-content' },
    },
    {
      props: { isEditing: false },
      style: { height: '25px' },
    },
  ],
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, .5)',
  },
});

export const AddListInput = styled.input` 
  border-radius: 5px;
  border: none;
  padding: 6px 8px;
  margin: auto auto 10px;
`;

export const AddListButton = styled(Button)` 
  margin: 0;
`;

export const CloseAddListButton = styled(Button)` 
  position: absolute;
  left: 85px;
  border: none;
  color: black;
`;

type DrawerContainerProps = {
  background?: string;
  isOpen: boolean;
};

const openStyles = {
  minWidth: '35vw',
  width: '35vw',
  '@media (max-width: 600px)': {
    minWidth: '50vw',
    width: '50vw',
  },
};

export const DrawerContainer = styled('div')<DrawerContainerProps>({
  minHeight: '100vh',
  borderRight: '1px solid white',
  transition: 'width 0.25s ease-in-out',
  zIndex: 5,
  variants: [
    {
      props: { isOpen: true, background: 'green' },
      style: { background: '#519839', ...openStyles },
    },
    {
      props: { isOpen: true, background: 'lightGreen' },
      style: { background: '#4bbf6b', ...openStyles },
    },
    {
      props: { isOpen: true, background: 'blue' },
      style: { background: '#0079bf', ...openStyles },
    },
    {
      props: { isOpen: true, background: 'orange' },
      style: { background: '#d29034', ...openStyles },
    },
    {
      props: { isOpen: true, background: 'red' },
      style: { background: '#b04632', ...openStyles },
    },
    {
      props: { isOpen: false, background: 'transparent' },
      style: { background: 'transparent', width: '0.7vw' },
    },
  ],
});

export const DrawerHeader = styled.div`
  position: relative;
  height: 12%;
  border-bottom: 1px solid white;
`;

export const DrawerHeaderTitle = styled.div` 
  font-family: ${fontFamily};
  font-size: 16px;
  width: 60%;
  color: white;
  padding: 8px 10px;
  font-weight: 600;
  overflow: auto;
  word-break: break-word;
`;

export const YourBoardsTitle = styled.div` 
  font-family: ${fontFamily};
  font-size: 14px;
  color: white;
  padding: 8px 10px;
  font-weight: 600;
`;

export const BoardTitle = styled(YourBoardsTitle)` 
  font-weight: 300;
`;

export const BoardsLinkContainer = styled.div` 
  display: flex;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.4)
  }
`;

type DrawerBoardEntryProps = {
  isSelected: boolean;
};

export const DrawerBoardEntry = styled('div')<DrawerBoardEntryProps>({
  display: 'flex',
  cursor: 'pointer',
  variants: [
    {
      props: { isSelected: true },
      style: { background: 'rgba(255, 255, 255, 0.4)' },
    },
    {
      props: { isSelected: false },
      style: { background: 'transparent' },
    },
  ],
});
