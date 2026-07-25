import { globalStyle, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import {
  boardBarVars,
  boardGradientVars,
  boardNavVars,
  fixedChromeOffset,
  fontFamily,
  mapBoardBackgrounds,
} from '~/styles/tokens';

const navBackgroundFlashAnimation = {
  animation: 'nav-background-flash 0.45s ease-out',
};

const navSolidBackgroundTransition = {
  transition: 'background-color 0.35s ease-out',
  ...navBackgroundFlashAnimation,
};

export const navBarContainer = style({
  boxSizing: 'border-box',
  width: '100%',
  zIndex: 2,
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  position: 'fixed',
});

export const navBarContent = recipe({
  base: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: '46px',
    ...navSolidBackgroundTransition,
  },
  variants: {
    background: mapBoardBackgrounds((name) => ({
      background: boardNavVars[name],
    })),
  },
});

export const navColumn = style({
  flex: '1 1 0',
  display: 'flex',
  justifyContent: 'flex-end',
});

export const boardHeaderContainer = recipe({
  base: [
    navBarContainer,
    {
      padding: '10px',
      zIndex: 1,
      position: 'relative',
      ...navSolidBackgroundTransition,
    },
  ],
  variants: {
    background: mapBoardBackgrounds((name) => ({
      background: boardBarVars[name],
      borderBottom: '1px solid white',
    })),
  },
});

export const boardPageBackgroundBase = style({
  boxSizing: 'border-box',
  height: '100vh',
  width: '100%',
  background: 'transparent',
  position: 'relative',
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  padding: `${fixedChromeOffset} 30px 30px`,
  ...navBackgroundFlashAnimation,
});

// Lists keep their own width and scroll sideways instead of being squeezed
// into the viewport.
globalStyle(`${boardPageBackgroundBase} > *`, {
  flexShrink: 0,
});

export const boardPageGradientVariants = mapBoardBackgrounds((name) => ({
  background: boardGradientVars[name],
}));

export const boardPageBackground = recipe({
  base: boardPageBackgroundBase,
  variants: {
    background: boardPageGradientVariants,
  },
});

export const boardTitle = style({
  color: 'inherit',
  background: 'none',
  border: 'none',
  padding: '10px',
  cursor: 'pointer',
  display: 'inline-block',
  width: 'max-content',
  borderRadius: '8px',
  fontSize: '16px',
  fontWeight: 500,
  fontFamily,

  ':hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export const editBoardTitleForm = style({
  width: 'max-content',
  height: '40px',
  position: 'relative',
  top: '-5px',
});

export const editBoardTitleInput = style({
  fontFamily,
  fontWeight: 500,
  fontSize: '16px',
  borderRadius: '0px',
  border: 'none',
  margin: '8px 0px 12px',
  padding: '10px',
});
