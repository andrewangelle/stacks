import { css, keyframes } from 'styled-components';

const fadeInFrames = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const displayMenuSlideUpFrames = keyframes`
  from {
    transform: translateX(-50%) translateY(calc(100% + 24px));
  }
  to {
    transform: translateX(-50%) translateY(0);
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
