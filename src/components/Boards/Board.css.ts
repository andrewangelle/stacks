import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import {
  boardPageBackgroundBase,
  boardPageGradientVariants,
} from '~/components/Nav/Nav.css';
import { button } from '~/styles/Page.css';
import { fontFamily } from '~/styles/tokens';

export const boardListsFallback = recipe({
  base: [
    boardPageBackgroundBase,
    {
      position: 'absolute',
      inset: 0,
      height: 'auto',
      width: 'auto',
      padding: 0,
    },
  ],
  variants: {
    background: boardPageGradientVariants,
  },
});

export const boardHeaderFallback = style({
  height: '39.5px',
});

export const addListContainer = style({
  position: 'relative',
  fontFamily,
  backgroundColor: 'rgba(255, 255, 255, .3)',
  padding: '12px 12px 10px',
  width: '225px',
  borderRadius: '8px',
  color: '#fff',
  cursor: 'pointer',
  height: '25px',

  selectors: {
    '&[data-editing]': {
      height: 'max-content',
      backgroundColor: '#ebecf0',
    },
    '&:hover:not([data-editing])': {
      backgroundColor: 'rgba(255, 255, 255, .5)',
    },
  },
});

export const addListInput = style({
  borderRadius: '8px',
  border: 'none',
  padding: '9px',
  boxShadow: '0 1px 0 #091e4240',
  margin: '4px 0px 8px',
  width: 'stretch',
});

export const createListButton = style([
  button,
  {
    margin: 0,
    padding: '8px',
  },
]);

export const closeAddListButton = style([
  button,
  {
    border: 'none',
    color: 'black',
    padding: '8px',
    background: 'none',
    cursor: 'pointer',
    margin: '0 8px',
    fontWeight: 600,

    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, .3)',
    },
  },
]);

export const boardTitle = style({
  fontFamily,
  fontSize: '14px',
  color: 'white',
  padding: '8px 10px',
  fontWeight: 600,
});

export const boardsLinkContainer = style({
  display: 'flex',
  cursor: 'pointer',

  ':hover': {
    background: 'rgba(255, 255, 255, 0.4)',
  },
});
