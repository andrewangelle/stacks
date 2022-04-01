import styled from 'styled-components';
import * as Popover from '@radix-ui/react-popover';

export const green = 'rgb(81, 152, 57)';
export const lightGreen = 'rgb(75, 191, 107)';
export const blue = 'rgb(0, 121, 191)';
export const orange = 'rgb(210, 144, 52)';
export const red = 'rgb(176, 70, 50)';
export const fontFamily = '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;'
export const darkGray = '#5e6c84';

export const BoardsContainer = styled.div` 
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const BoardCard = styled.div<{background?: string;}>` 
  font-family: ${fontFamily};
  text-align: center;
  width: -webkit-fill-available;
  max-width: 15%;
  height: 80px;
  padding: 20px;
  border-radius: 5px;
  font-size: 14px;
  cursor: pointer;
  background: ${props => props.background};
  margin: 10px;
`

export const CreateBoardCard = styled(BoardCard)` 
  background: rgba(9, 30, 66, 0.04);
  width: 100%;

  &:hover {
    background: rgba(9, 30, 66, 0.08); 
  }

  &:active {
    background: #e4f0f6;
    color: #0079bf;
  }
`

export const CreateBoardPopoverTrigger = styled(Popover.Trigger)` 
  background: transparent;
  border: none;
  color: inherit;
  width: 100%; 
`;

export const PopoverClose = styled(Popover.Close)` 
  background: transparent;
  border: none;
  color: inherit;
  width: 25px;
  cursor: pointer;
  position: absolute;
  right: 0;
`;

export const CreateBoardPopoverContent = styled(Popover.Content)` 
  height: 80vh;
  width: 225px;
  border: 2px solid rgba(9, 30, 66, 0.08);
  border-radius: 5px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
`;

export const CreateBoardPopoverHeader = styled.div` 
  display: flex;
  justify-content: center;
  color: rgba(9, 30, 66, .75);
`

export const CreateBoardCloseBorder = styled.hr` 
  margin: 5px;
`

export const CreateBoardBackgroundText = styled.div` 
  font-family: ${fontFamily};
  font-size: 12px;
  font-weight: 700;
  color: rgba(9, 30, 66, .75);
`;

export const CreateBoardBackgroundChoices = styled.div` 
  display: flex;
  flex-wrap: wrap;
`;

export const CreateBoardBackgroundChoice = styled.div<{background: string;}>` 
  background: ${props => props.background};
  width: 40px;
  height: 32px;
  border-radius: 5px;
  margin: 5px;
  position: relative;
  color: #fff;
  cursor: pointer;

  &:hover {
    ${props => {
      const rgbaNumbers = props.background
        .split('(')
        .join('')
        .split('rgb')
        .filter(Boolean)
        .map(value => value.split(')')[0])
        .join('');

      return `
          background: rgba(${rgbaNumbers}, .8);
      `
    }}
  }
`;

export const CreateBoardTitleInput = styled.input`
  width: 200px;
  margin: 5px;
  height: 20px;
`

export const CreateBoardButton = styled.button<{isDisabled: boolean}>` 
  background: ${props => props.isDisabled ? 'rgba(9, 30, 66, 0.04)' : blue};
  color: ${props => props.isDisabled ? 'rgba(9, 30, 66, 0.08)' : '#fff'};
  border: none;
  border-radius: 5px;
  width: 200px;
  height: 20px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  cursor: pointer;
`;


