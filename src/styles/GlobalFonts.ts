import { globalCss } from '@pigment-css/react';

import { fontFamily } from './tokens';

globalCss`
  @font-face {
    font-family: 'App Sans';
    src: url('/AppSans-latin.woff2') format('woff2');
	  font-weight: 100 900;
    font-style: normal;
    font-display: swap;
  }

  body {
    font-family: ${fontFamily};
    font-weight: 400;
    font-style: normal;
    padding: 0;
    margin: 0;
  }
`;

export default function GlobalFonts() {
  return null;
}
