import { styled } from '@pigment-css/react';
import * as Ti from 'react-icons/ti';
import { fontFamily } from '~/components/Boards/Boards.styled';
import { animationStyles } from '~/styles/animations';
import { Button } from '~/styles/Page.styled';
import { focusRingBlue } from '~/styles/tokens';
import { activityFieldStyles } from '../Activity/Activity.styled';

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

export const DeleteListIcon = styled(Ti.TiDelete)` 
  position: relative;
  top: -4px;
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
