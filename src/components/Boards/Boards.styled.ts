import { styled } from '@pigment-css/react';
import * as Popover from '@radix-ui/react-popover';
import { Link } from '@tanstack/react-router';
import { TiDelete } from 'react-icons/ti';
import { animationStyles } from '~/styles/animations';
import {
  blue,
  boardGradientHoverVars,
  boardGradientVars,
  darkGray,
  fontFamily,
  green,
  lightGreen,
  orange,
  red,
} from '~/styles/tokens';

export { blue, darkGray, fontFamily, green, lightGreen, orange, red };

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
  padding: 50px 30px 30px;
`;

export const BoardCardLink = styled(Link)<BackgroundProps>({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'relative',
  border: 'none',
  margin: '10px',
  padding: 0,
  width: '100%',
  maxWidth: '15%',
  minWidth: '200px',
  height: '110px',
  borderRadius: '8px',
  boxShadow:
    '0 1px 0.5px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.12)',
  fontFamily: fontFamily,
  textAlign: 'left',
  textDecoration: 'none',
  overflow: 'hidden',
  fontSize: '14px',
  cursor: 'pointer',
  variants: [
    {
      props: { background: 'green' },
      style: {
        background: boardGradientVars.green,
        '&:hover': { background: boardGradientHoverVars.green },
        '&:focus': { background: boardGradientHoverVars.green },
      },
    },
    {
      props: { background: 'lightGreen' },
      style: {
        background: boardGradientVars.lightGreen,
        '&:hover': { background: boardGradientHoverVars.lightGreen },
        '&:focus': { background: boardGradientHoverVars.lightGreen },
      },
    },
    {
      props: { background: 'blue' },
      style: {
        background: boardGradientVars.blue,
        '&:hover': { background: boardGradientHoverVars.blue },
        '&:focus': { background: boardGradientHoverVars.blue },
      },
    },
    {
      props: { background: 'orange' },
      style: {
        background: boardGradientVars.orange,
        '&:hover': { background: boardGradientHoverVars.orange },
        '&:focus': { background: boardGradientHoverVars.orange },
      },
    },
    {
      props: { background: 'red' },
      style: {
        background: boardGradientVars.red,
        '&:hover': { background: boardGradientHoverVars.red },
        '&:focus': { background: boardGradientHoverVars.red },
      },
    },
  ],
  '&:active': {
    color: `${blue}`,
  },
});

export const CreateBoardContainer = styled('div')<BackgroundProps>({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'relative',
  border: 'none',
  margin: '10px',
  padding: 0,
  width: '100%',
  maxWidth: '15%',
  minWidth: '200px',
  height: '110px',
  borderRadius: '8px',
  boxShadow:
    '0 1px 0.5px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.12)',
  fontFamily: fontFamily,
  textAlign: 'left',
  textDecoration: 'none',
  overflow: 'hidden',
  fontSize: '14px',
  cursor: 'pointer',
  variants: [
    {
      props: { background: 'green' },
      style: {
        background: boardGradientVars.green,
        '&:hover': { background: boardGradientHoverVars.green },
        '&:focus': { background: boardGradientHoverVars.green },
      },
    },
    {
      props: { background: 'lightGreen' },
      style: {
        background: boardGradientVars.lightGreen,
        '&:hover': { background: boardGradientHoverVars.lightGreen },
        '&:focus': { background: boardGradientHoverVars.lightGreen },
      },
    },
    {
      props: { background: 'blue' },
      style: {
        background: boardGradientVars.blue,
        '&:hover': { background: boardGradientHoverVars.blue },
        '&:focus': { background: boardGradientHoverVars.blue },
      },
    },
    {
      props: { background: 'orange' },
      style: {
        background: boardGradientVars.orange,
        '&:hover': { background: boardGradientHoverVars.orange },
        '&:focus': { background: boardGradientHoverVars.orange },
      },
    },
    {
      props: { background: 'red' },
      style: {
        background: boardGradientVars.red,
        '&:hover': { background: boardGradientHoverVars.red },
        '&:focus': { background: boardGradientHoverVars.red },
      },
    },
  ],
  '&:active': {
    color: `${blue}`,
  },
});

export type BoardCardTitleProps = {
  isCreateBoard?: boolean;
};

export const BoardCardTitle = styled('div')<BoardCardTitleProps>({
  fontSize: '14px',
  background: '#fff',
  padding: '10px',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',
});

export const BoardCardSkeleton = styled(CreateBoardContainer)({
  background: 'rgba(9, 30, 66, 0.25)',
  cursor: 'default',
  pointerEvents: 'none',
  ...animationStyles.pulse,
});

export const CreateBoardCard = styled(CreateBoardContainer)` 
  background: rgba(9, 30, 66, 0.04);
  max-height: 100px;
  padding-bottom: 10px;
  justify-content: center;
  text-align: center;
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
  width: max-content; 
  min-width: 125px;
`;

export const PopoverClose = styled(Popover.Close)` 
  background: transparent;
  border: none;
  color: inherit;
  /* width: 25px; */
  cursor: pointer;
  position: absolute;
  right: 8px;
  margin: 0px 4px 4px 4px;

  &:hover {
    background: rgba(0,0,0, 0.1);
    border-radius: 4px;
  }
`;

export const CreateBoardPopoverContent = styled(Popover.Content)` 
  height: auto;
  width: 225px;
  border: 2px solid rgba(9, 30, 66, 0.08);
  border-radius: 8px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  padding: 10px 25px 25px 25px;
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
        background: boardGradientVars.green,
        '&:hover': { background: boardGradientHoverVars.green },
      },
    },
    {
      props: { background: 'lightGreen' },
      style: {
        background: boardGradientVars.lightGreen,
        '&:hover': { background: boardGradientHoverVars.lightGreen },
      },
    },
    {
      props: { background: 'blue' },
      style: {
        background: boardGradientVars.blue,
        '&:hover': { background: boardGradientHoverVars.blue },
      },
    },
    {
      props: { background: 'orange' },
      style: {
        background: boardGradientVars.orange,
        '&:hover': { background: boardGradientHoverVars.orange },
      },
    },
    {
      props: { background: 'red' },
      style: {
        background: boardGradientVars.red,
        '&:hover': { background: boardGradientHoverVars.red },
      },
    },
  ],
});

export const CreateBoardTitleInput = styled.input`
  width: 200px;
  margin: 5px;
  height: 20px;
`;

type CreateBoardButtonProps = {
  disabled: boolean;
};

export const CreateBoardButton = styled('button')<CreateBoardButtonProps>({
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
      props: { disabled: true },
      style: {
        background: 'rgba(9, 30, 66, 0.04)',
        color: 'rgba(9, 30, 66, 0.08)',
      },
    },
    {
      props: { disabled: false },
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
