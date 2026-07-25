import { globalFontFace, globalStyle } from '@vanilla-extract/css';
import { fontFamily } from '~/styles/tokens';

globalFontFace('App Sans', {
  src: "url('/AppSans-latin.woff2') format('woff2')",
  fontWeight: '100 900',
  fontStyle: 'normal',
  fontDisplay: 'swap',
});

globalStyle('html', {
  scrollSnapType: 'both mandatory',
  margin: 0,
  padding: 0,
  overscrollBehavior: 'none',
});

globalStyle('body', {
  fontFamily,
  fontWeight: 400,
  fontStyle: 'normal',
  padding: 0,
  margin: 0,
});
