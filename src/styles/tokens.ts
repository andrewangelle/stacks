export const darkGray = '#5e6c84';
export const green = '#519839';
export const lightGreen = '#4bbf6b';
export const blue = '#0079bf';
export const orange = '#d29034';
export const red = '#b04632';
export const checklistProgressBlue = '#5ba4cf';
export const focusRingBlue = '#2F80ED';
export const fontFamily =
  '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;';

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

export const tokenShades = {
  darkGray: {
    darkest: '#38414f',
    darker: '#4b566a',
    base: '#5e6c84',
  },
  green: {
    darkest: '#315b22',
    darker: '#366426',
    base: '#519839',
  },
  lightGreen: {
    darkest: '#2d7340',
    darker: '#327f47',
    base: '#4bbf6b',
  },
  blue: {
    darkest: '#004973',
    darker: '#00466d',
    base: '#0079bf',
  },
  orange: {
    darkest: '#7e561f',
    darker: '#8b6022',
    base: '#d29034',
  },
  red: {
    darkest: '#6a2a1e',
    darker: '#64271c',
    base: '#b04632',
  },
  checklistProgressBlue: {
    darkest: '#37627c',
    darker: '#4983a6',
    base: '#5ba4cf',
  },
  focusRingBlue: {
    darkest: '#1c4d8e',
    darker: '#2666be',
    base: '#2F80ED',
  },
} as const;
