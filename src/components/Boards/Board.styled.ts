import { styled } from '@pigment-css/react';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { BoardPageBackground } from '~/components/Nav/Nav.styled';
import { Button } from '~/styles/Page.styled';

export const BoardListsFallback = styled(BoardPageBackground)`
  top: -8px;
  left: -30px;
  padding: 0;
`;

export const AddListContainer = styled('div')({
  position: 'relative',
  fontFamily: fontFamily,
  backgroundColor: 'rgba(255, 255, 255, .3)',
  padding: '12px 12px 10px',
  width: '225px',
  borderRadius: '8px',
  color: '#fff',
  cursor: 'pointer',
  height: '25px',
  '&[data-editing]': {
    height: 'max-content',
    backgroundColor: '#ebecf0',
  },
  '&:hover:not([data-editing])': {
    backgroundColor: 'rgba(255, 255, 255, .5)',
  },
});

export const AddListInput = styled.input` 
  border-radius: 8px;
  border: none;
  padding: 9px;
  box-shadow: 0 1px 0 #091e4240;
  margin: 4px 0px 8px;
  width: stretch;
`;

export const CreateListButton = styled(Button)` 
  margin: 0;
  padding: 8px;
`;

export const CloseAddListButton = styled(Button)` 
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

export const BoardTitle = styled.div` 
  font-family: ${fontFamily};
  font-size: 14px;
  font-weight: 300;
  color: white;
  padding: 8px 10px;
  font-weight: 600;
`;

export const BoardsLinkContainer = styled.div` 
  display: flex;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.4)
  }
`;
