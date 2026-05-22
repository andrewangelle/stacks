import { styled } from '@pigment-css/react';
import { Link } from '@tanstack/react-router';
import type { ReactNode } from 'react';
import type { BackgroundProps } from '~/components/Boards/Boards.styled';
import { blue, boardGradientVars } from '~/styles/tokens';

type PaddingProps = {
  padding: string;
  children: ReactNode;
};

export function Padding({ padding, children }: PaddingProps) {
  return <div style={{ padding }}>{children}</div>;
}

export const Center = styled.div` 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const FlexColumn = styled.div` 
  display: flex;
  flex-direction: column;
  margin: 10px auto;
`;

export const Flex = styled.div` 
  display: flex;
`;

export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

`;

type ButtonExtraProps = {
  isDisabled?: boolean;
  secondary?: boolean;
};

export const Button = styled('button')<ButtonExtraProps>({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '5px',
  margin: 'auto',
  display: 'flex',
  alignSelf: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',

  // applies hover effect to the button
  '&::before': {
    content: '""',
    position: 'absolute',
    inset: 0,
    borderRadius: 'inherit',
    backgroundColor: '#000',
    opacity: 0,
    pointerEvents: 'none',
    transition: 'opacity 0.15s ease',
  },

  '&:hover:not(:disabled)::before': {
    opacity: 0.1,
  },

  variants: [
    {
      props: { secondary: true },
      style: {
        background: 'rgba(9, 30, 66, 0.04)',
        color: blue,
        border: `1px solid ${blue}`,
        cursor: 'pointer',
      },
    },
    {
      props: { disabled: true },
      style: {
        background: 'grey',
        color: '#fff',
        border: 'none',
        cursor: 'not-allowed',
        '&:hover::before': {
          opacity: 0,
        },
      },
    },
    {
      props: { isDisabled: true },
      style: {
        background: 'rgba(9, 30, 66, 0.04)',
        color: 'rgba(9, 30, 66, 0.08)',
        border: 'none',
        cursor: 'not-allowed',
        '&:hover::before': {
          opacity: 0,
        },
      },
    },
    {
      props: {
        disabled: undefined,
        isDisabled: undefined,
        secondary: undefined,
      },
      style: {
        background: blue,
        color: '#fff',
        border: 'none',
        cursor: 'pointer',
      },
    },
  ],
  '&:hover': {
    color: 'white',
  },
});

type BoardPageBackgroundProps = {
  background?: string;
};

export const BoardPageBackground = styled('div')<BoardPageBackgroundProps>({
  height: '100vh',
  width: 'max-content',
  minWidth: '100vw',
  display: 'flex',
  background: 'transparent',
  variants: [
    {
      props: { background: 'blue' },
      style: { background: boardGradientVars.blue },
    },
    {
      props: { background: 'green' },
      style: { background: boardGradientVars.green },
    },
    {
      props: { background: 'lightGreen' },
      style: { background: boardGradientVars.lightGreen },
    },
    {
      props: { background: 'orange' },
      style: { background: boardGradientVars.orange },
    },
    {
      props: { background: 'red' },
      style: { background: boardGradientVars.red },
    },
  ],
});

export const NavBarContainer = styled('div')<BackgroundProps>({
  width: '100%',
  position: 'fixed',
  height: '40px',
  padding: '0px 10px 0px 0px',
  zIndex: 1,
  variants: [
    {
      props: { background: 'blue' },
      style: {
        background: boardGradientVars.blue,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'green' },
      style: {
        background: boardGradientVars.green,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'lightGreen' },
      style: {
        background: boardGradientVars.lightGreen,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'orange' },
      style: {
        background: boardGradientVars.orange,
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'red' },
      style: {
        background: boardGradientVars.red,
        borderBottom: '1px solid white',
      },
    },
  ],
  display: 'flex',
  justifyContent: 'space-between',
  color: 'white',
});

export const LogOutText = styled.div` 
  position: absolute;
  right: 15px;
  top: 25%;
  cursor: pointer;
`;

export const LogoLink = styled(Link)({
  textDecoration: 'none',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: 'unset',
});
