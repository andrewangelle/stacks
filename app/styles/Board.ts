import styled from 'styled-components';
import { Button, fontFamily } from '~/styles';

export const AddListContainer = styled.div<{isEditing: boolean}>`
  position: relative;
  font-family: ${fontFamily};
  background-color: rgba(255, 255, 255, .3);
  padding: 12px 16px;
  height: ${props => props.isEditing ? 'max-content' : '25px'};
  width: 225px;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, .5);
  }
`;

export const AddListInput = styled.input` 
  border-radius: 5px;
  border: none;
  padding: 6px 8px;
  margin: auto auto 10px;
`

export const AddListButton = styled(Button)` 
  margin: 0;
`

export const CloseAddListButton = styled(Button)` 
  position: absolute;
  left: 85px;
  border: none;
  color: black;
`;

export const DrawerContainer = styled.div<{background?: string; isOpen: boolean}>`
  min-height: 100vh;
  width: ${props => props.isOpen ? '24vw' : '0.7vw'};
  border-right: 1px solid white;
  transition: width 0.25s ease-in-out;
  z-index: 2;
  
  ${props => {
    if(!props.isOpen && props.background){
      return `
        background: rgba(255, 255, 255, 0.16);
      `
    }

    return `
      background: ${props.background};
    `
  }}
`;

export const DrawerHeader = styled.div`
  position: relative;
  height: 12%;
  border-bottom: 1px solid white;
`

export const DrawerHeaderTitle = styled.div` 
  font-family: ${fontFamily};
  font-size: 16px;
  width: 60%;
  color: white;
  padding: 8px 10px;
  font-weight: 600;
  overflow: auto;
  word-break: break-word;
`

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
`

export const DrawerBoardEntry = styled.div<{isSelected: boolean}>` 
  display: flex;
  cursor: pointer;
  ${props => {
    if(props.isSelected){
      return `
        background: rgba(255, 255, 255, 0.4);
      `
    }
  }}

  &:hover {
    background: rgba(255, 255, 255, 0.4)
  }
`