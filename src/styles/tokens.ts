export const darkGray = '#5e6c84';
export const green = '#519839';
export const lightGreen = '#4bbf6b';
export const blue = '#0C66E4';
export const orange = '#d29034';
export const red = '#b04632';
export const focusRingBlue = '#2F80ED';
export const fontFamily = "'App Sans', sans-serif";
export const completedGreen = '#1f845a';

/** References gradients in `board-gradient.css` — edit that file to tune. */
export const boardGradientVars = {
  green: 'var(--board-gradient-green)',
  lightGreen: 'var(--board-gradient-light-green)',
  blue: 'var(--board-gradient-blue)',
  orange: 'var(--board-gradient-orange)',
  red: 'var(--board-gradient-red)',
} as const;

export const boardGradientHoverVars = {
  green: 'var(--board-gradient-green-hover)',
  lightGreen: 'var(--board-gradient-light-green-hover)',
  blue: 'var(--board-gradient-blue-hover)',
  orange: 'var(--board-gradient-orange-hover)',
  red: 'var(--board-gradient-red-hover)',
} as const;

/** Nav/board bar solids in `board-gradient.css` — darkest nav, lighter board bar. */
export const boardNavVars = {
  green: 'var(--board-nav-green)',
  lightGreen: 'var(--board-nav-light-green)',
  blue: 'var(--board-nav-blue)',
  orange: 'var(--board-nav-orange)',
  red: 'var(--board-nav-red)',
} as const;

export const boardBarVars = {
  green: 'var(--board-bar-green)',
  lightGreen: 'var(--board-bar-light-green)',
  blue: 'var(--board-bar-blue)',
  orange: 'var(--board-bar-orange)',
  red: 'var(--board-bar-red)',
} as const;

export const tokenShades = {
  darkGray: {
    darkest: '#38414f',
    darker: '#4b566a',
    base: '#5e6c84',
  },
  green: {
    darkest: '#315b22',
    darker: '#417a2e',
    base: '#519839',
  },
  lightGreen: {
    darkest: '#2d7340',
    darker: '#3c9956',
    base: '#4bbf6b',
  },
  blue: {
    darkest: '#004973',
    darker: '#00578a',
    base: '#0079bf',
  },
  orange: {
    darkest: '#7e561f',
    darker: '#a8732a',
    base: '#d29034',
  },
  red: {
    darkest: '#6a2a1e',
    darker: '#7f3224',
    base: '#b04632',
  },
  focusRingBlue: {
    darkest: '#1c4d8e',
    darker: '#2666be',
    base: '#2F80ED',
  },
} as const;
