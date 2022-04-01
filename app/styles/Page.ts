import styled from 'styled-components';
import { blue } from './Boards';

export const Padding = styled.div<{padding: string}>` 
  padding: ${props => props.padding};
`;

export const Center = styled.div` 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const FlexColumn = styled.div` 
  display: flex;
  flex-direction: column;
  margin: 10px auto;
`;

export const Flex = styled.div` 
  display: flex;
`

export const Button = styled.button<{isDisabled?: boolean; secondary?: boolean}>`
  background: ${props => props.isDisabled ? 'rgba(9, 30, 66, 0.04)' : blue};
  color: ${props => props.isDisabled ? 'rgba(9, 30, 66, 0.08)' : '#fff'};
  border: none;
  border-radius: 5px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;


  ${props => {
    if(props.secondary){
      return ` 
        background: rgba(9, 30, 66, 0.04);
        border: 1px solid ${blue};
        color: ${blue}
      `
    }
  }}
`;

export const BoardPageBackground = styled.div<{background?: string}>` 
  height: 100vh; 
  width: max-content; 
  min-width: 100vw;
  background: ${props => props.background};
  display: flex;
`;