import { styled } from '@pigment-css/react';
import * as Ti from 'react-icons/ti';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { animationStyles } from '~/styles/animations';
import { Button } from '~/styles/Page.styled';

export const ListGridContainer = styled.div` 
  display: grid;
  grid-template-rows: 100% 1fr max-content;
  grid-template-columns: 100px 1fr max-content;
`;

export const ListContainer = styled.div` 
  background-color: #ebecf0;
  border-radius: 3px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  max-height: 100%;
  height: max-content;
  position: relative;
  white-space: normal;
  width: 275px;
  padding: 15px 15px 7.5px;
  margin: 0 15px;
`;

export const ListName = styled.div` 
  font-family: ${fontFamily};
  color: black;
  font-weight: 700;
  font-size: 14px;
`;

export const AddCardText = styled.button` 
  border: none;
  background: none;
  font-family: ${fontFamily};
  cursor: pointer;
  font-size: 14px;
  border-radius: 5px;
  padding: 8px;
  margin-top: 4px;
  width: 100%;
  text-align: left;
  
  &:hover {
    background-color: rgba(0, 0, 0, .3);
  }
`;

export const AddCardInput = styled.input` 
  border-radius: 5px;
  border: none;
  padding: 9px;
  margin: 8px 0px 12px;
  box-shadow: 0 1px 0 #091e4240;
`;

export const AddCardButton = styled(Button)` 
  margin: 0;
  padding: 8px;
`;

export const CloseAddCardButton = styled(Button)` 
  border: none;
  color: black;
  padding: 8px;
  background: none;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, .3);
  }
`;

export const ListCardContainer = styled.div` 
  border-radius: 5px;
  background: #fff;
  font-family: ${fontFamily};
  font-size: 14px;
  padding: 8px;
  margin: 4px 0px;
  box-shadow: 0 1px 0 #091e4240;
  display: flex;
  flex-direction: column;
  align-items: start;
  gap: 8px;
`;

export const ListCardSkeleton = styled(ListCardContainer)({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  minHeight: '16px',
  ...animationStyles.pulse,
});

export const DeleteListIcon = styled(Ti.TiDelete)` 
  position: absolute;
  top: 15px;
  right: 10px;
  cursor: pointer;

  &:hover {
    background: rgba(0,0,0, 0.3);
    border-radius: 15px;
  }
`;

export const DragListShadow = styled.div<{ height?: number; width?: number }>({
  height: ({ height }) => `${height ?? 0}px`,
  width: ({ width }) => `${width ?? 0}px`,
  background: 'rgba(0,0,0,0.1)',
  margin: '0 15px',
  borderRadius: '5px',
});
