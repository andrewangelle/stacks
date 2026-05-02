import { styled } from '@pigment-css/react';
import * as Popover from '@radix-ui/react-popover';
import { TiDelete } from 'react-icons/ti';

export const darkGray = '#5e6c84';
export const green = '#519839';
export const lightGreen = '#4bbf6b';
export const blue = '#0079bf';
export const orange = '#d29034';
export const red = '#b04632';
export const fontFamily =
  '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;';

export type BoardBackground =
  | 'green'
  | 'lightGreen'
  | 'blue'
  | 'orange'
  | 'red';

export type BackgroundProps = {
  background?: BoardBackground;
};

export const BoardsContainer = styled.div` 
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
`;

export const BoardCardContainer = styled('div')<BackgroundProps>({
  position: 'relative',
  fontFamily: fontFamily,
  textAlign: 'center',
  width: '100%',
  maxWidth: '15%',
  height: '80px',
  padding: '20px',
  borderRadius: '5px',
  fontSize: '14px',
  cursor: 'pointer',
  margin: '10px',
  variants: [
    {
      props: { background: 'green' },
      style: { background: '#519839' },
    },
    {
      props: { background: 'lightGreen' },
      style: { background: '#4bbf6b' },
    },
    {
      props: { background: 'blue' },
      style: { background: '#0079bf' },
    },
    {
      props: { background: 'orange' },
      style: { background: '#d29034' },
    },
    {
      props: { background: 'red' },
      style: { background: '#b04632' },
    },
  ],
});
// `
//   position: relative;
//   font-family: ${fontFamily};
//   text-align: center;
//   width: -webkit-fill-available;
//   max-width: 15%;
//   height: 80px;
//   padding: 20px;
//   border-radius: 5px;
//   font-size: 14px;
//   cursor: pointer;
//   background: ${(props: { background?: string }) => props.background};
//   margin: 10px;
// `;

export const CreateBoardCard = styled(BoardCardContainer)` 
  background: rgba(9, 30, 66, 0.04);
  width: 100%;

  &:hover {
    background: rgba(9, 30, 66, 0.08); 
  }

  &:active {
    background: #e4f0f6;
    color: #0079bf;
  }
`;

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
  font-weight: 700;
`;

export const CreateBoardCloseBorder = styled.hr` 
  margin: 5px;
`;

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

export const CreateBoardBackgroundChoice = styled('div')<BackgroundProps>({
  width: '40px',
  height: '32px',
  borderRadius: '5px',
  margin: '5px',
  position: 'relative',
  color: '#fff',
  cursor: 'pointer',
  variants: [
    {
      props: { background: 'green' },
      style: {
        background: '#519839',
        '&:hover': { background: 'rgba(81, 152, 57, .8)' },
      },
    },
    {
      props: { background: 'lightGreen' },
      style: {
        background: '#4bbf6b',
        '&:hover': { background: 'rgba(75, 191, 107, .8)' },
      },
    },
    {
      props: { background: 'blue' },
      style: {
        background: '#0079bf',
        '&:hover': { background: 'rgba(0, 121, 191, .8)' },
      },
    },
    {
      props: { background: 'orange' },
      style: {
        background: '#d29034',
        '&:hover': { background: 'rgba(210, 144, 52, .8)' },
      },
    },
    {
      props: { background: 'red' },
      style: {
        background: '#b04632',
        '&:hover': { background: 'rgba(176, 70, 50, .8)' },
      },
    },
  ],
});

export const CreateBoardTitleInput = styled.input`
  width: 200px;
  margin: 5px;
  height: 20px;
`;

type IsDisabledProps = {
  isDisabled: boolean;
};

export const CreateBoardButton = styled('button')<IsDisabledProps>({
  border: 'none',
  borderRadius: '5px',
  width: '200px',
  height: '20px',
  margin: 'auto',
  display: 'flex',
  alignSelf: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  variants: [
    {
      props: { isDisabled: true },
      style: {
        background: 'rgba(9, 30, 66, 0.04)',
        color: 'rgba(9, 30, 66, 0.08)',
      },
    },
    {
      props: { isDisabled: false },
      style: {
        background: blue,
        color: '#fff',
      },
    },
  ],
});

export const DeleteBoardIcon = styled(TiDelete)` 
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 15px 10px;
`;
