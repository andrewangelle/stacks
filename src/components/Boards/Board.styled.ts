import { styled } from '@pigment-css/react';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { Button } from '~/styles/Page.styled';

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
  border-radius: 8px;
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
