import { css, keyframes } from 'styled-components';

const fadeInFrames = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const pulseFrames = keyframes`
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
`;

export const animationStyles = {
  fadeIn: css`
    animation: ${fadeInFrames} 0.35s ease-out;
  `,
  pulse: css`
    animation: ${pulseFrames} 1.4s ease-in-out infinite;
  `,
};

export type AnimationName = keyof typeof animationStyles;
