export type AnimationName = 'fadeIn' | 'pulse';

export const animationStyles = {
  fadeIn: {
    animation: 'stacks-fade-in 0.35s ease-out',
  },
  pulse: {
    animation: 'stacks-pulse 1.4s ease-in-out infinite',
  },
};

export const animationVariants = (
  Object.keys(animationStyles) as AnimationName[]
).map((name) => ({
  props: { animation: name },
  style: animationStyles[name],
}));
