import { TiDelete } from 'react-icons/ti';
import styled from 'styled-components';
import { Button, fontFamily } from '~/styles';

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
  padding: 15px;
  margin: 0 15px;
`;

export const ListName = styled.div` 
  font-family: ${fontFamily};
  color: black;
  font-weight: 700;
  font-size: 14px;
`;

export const AddCardText = styled.div` 
  font-family: ${fontFamily};
  cursor: pointer;
  font-size: 14px;
  margin-top: 15px;
  border-radius: 5px;

  &:hover {
    background-color: rgba(0, 0, 0, .3);
  }
`

export const AddCardInput = styled.input` 
  border-radius: 5px;
  border: none;
  padding: 6px 8px;
  margin: auto auto 10px;
  width: 90%;
`;

export const AddCardButton = styled(Button)` 
  margin: 0;
  padding: 8px;
`

export const CloseAddCardButton = styled(Button)` 
  border: none;
  color: black;
  padding: 8px;
`;

export const ListCardContainer = styled.div` 
  width: 90%;
  border-radius: 5px;
  background: #fff;
  font-family: ${fontFamily};
  font-size: 14px;
  padding: 8px;
  margin: 4px auto;
  box-shadow: 0 1px 0 #091e4240;
`;

export const DeleteListEllipses = styled(TiDelete)` 
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px 10px 12px;
  cursor: pointer;
`