import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { animationStyles } from '~/styles/animations';
import {
  blue,
  boardGradientHoverVars,
  boardGradientVars,
  fontFamily,
  mapBoardBackgrounds,
} from '~/styles/tokens';

const gradientVariants = mapBoardBackgrounds((name) => ({
  background: boardGradientVars[name],
  ':hover': { background: boardGradientHoverVars[name] },
  ':focus': { background: boardGradientHoverVars[name] },
}));

export const gradientSwatchVariants = mapBoardBackgrounds((name) => ({
  background: boardGradientVars[name],
  ':hover': { background: boardGradientHoverVars[name] },
}));

export const boardsContainer = style({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'flex-start',
  padding: '50px 30px 30px',
});

const boardCardBase = style({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  position: 'relative',
  border: 'none',
  margin: '10px',
  padding: 0,
  overflow: 'hidden',
  width: '100%',
  maxWidth: '15%',
  minWidth: '200px',
  height: '110px',
  borderRadius: '8px',
  boxShadow:
    '0 1px 0.5px rgba(9, 30, 66, 0.25), 0 0 0 1px rgba(9, 30, 66, 0.12)',
  fontFamily,
  textAlign: 'left',
  textDecoration: 'none',
  fontSize: '14px',
  cursor: 'pointer',

  ':active': {
    color: blue,
  },
});

export const boardCardLink = recipe({
  base: [
    boardCardBase,
    {
      color: 'black',

      '@media': {
        '(max-width: 660px)': {
          width: '100%',
          maxWidth: '100%',
          height: '76px',
          borderRadius: '4px',
        },
      },
    },
  ],
  variants: {
    background: gradientVariants,
  },
});

export const createBoardContainer = recipe({
  base: boardCardBase,
  variants: {
    background: gradientVariants,
  },
});

export const boardCardTitle = style({
  fontSize: '14px',
  background: '#fff',
  padding: '10px',
  borderBottomLeftRadius: '8px',
  borderBottomRightRadius: '8px',

  '@media': {
    '(max-width: 660px)': {
      padding: '6px',
      textAlign: 'center',
      borderBottomLeftRadius: '4px',
      borderBottomRightRadius: '4px',
    },
  },
});

export const boardCardSkeleton = style([
  boardCardBase,
  {
    background: 'rgba(9, 30, 66, 0.25)',
    cursor: 'default',
    pointerEvents: 'none',
    ...animationStyles.pulse,
  },
]);

export const createBoardCard = style([
  boardCardBase,
  {
    padding: 0,
    margin: 0,
    background: 'rgba(9, 30, 66, 0.04)',
    maxHeight: '100px',
    paddingBottom: '10px',
    justifyContent: 'center',
    textAlign: 'center',

    ':hover': {
      background: 'rgba(9, 30, 66, 0.08)',
    },

    ':active': {
      background: '#e4f0f6',
      color: '#0079bf',
    },
  },
]);

export const createBoardPopoverTrigger = style({
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  width: 'max-content',
  minWidth: '125px',
});

export const popoverClose = style({
  background: 'transparent',
  border: 'none',
  color: 'inherit',
  cursor: 'pointer',
  position: 'absolute',
  right: '8px',
  margin: '0px 4px 4px 4px',

  ':hover': {
    background: 'rgba(0,0,0, 0.1)',
    borderRadius: '4px',
  },
});

export const createBoardPopoverContent = style({
  height: 'auto',
  width: '225px',
  border: '2px solid rgba(9, 30, 66, 0.08)',
  borderRadius: '8px',
  fontFamily,
  fontSize: '14px',
  background: '#fff',
  padding: '10px 25px 25px 25px',
});

export const createBoardPopoverHeader = style({
  display: 'flex',
  justifyContent: 'center',
  color: 'rgba(9, 30, 66, .75)',
  fontWeight: 700,
});

export const createBoardCloseBorder = style({
  margin: '5px',
});

export const createBoardBackgroundText = style({
  fontFamily,
  fontSize: '12px',
  fontWeight: 700,
  color: 'rgba(9, 30, 66, .75)',
});

export const createBoardBackgroundChoices = style({
  display: 'flex',
  flexWrap: 'wrap',
});

export const backgroundChoiceBase = style({
  border: 'none',
  background: 'transparent',
  width: '40px',
  height: '32px',
  borderRadius: '5px',
  margin: '5px',
  position: 'relative',
  cursor: 'pointer',
});

export const createBoardBackgroundChoice = recipe({
  base: backgroundChoiceBase,
  variants: {
    background: gradientSwatchVariants,
  },
});

export const createBoardTitleInput = style({
  width: '200px',
  margin: '5px',
  height: '20px',
});

export const createBoardButton = recipe({
  base: {
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
  },
  variants: {
    disabled: {
      true: {
        background: 'rgba(9, 30, 66, 0.04)',
        color: 'rgba(9, 30, 66, 0.08)',
      },
      false: {
        background: blue,
        color: '#fff',
      },
    },
  },
});

export const deleteBoardIcon = style({
  position: 'absolute',
  bottom: 0,
  right: 0,
  padding: '15px 10px',
});
