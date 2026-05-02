import { styled } from '@pigment-css/react';
import type { ReactNode } from 'react';
import { blue } from '~/styles/tokens';

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

type ButtonExtraProps = {
  isDisabled?: boolean;
  secondary?: boolean;
};

export const Button = styled('button')<ButtonExtraProps>({
  borderRadius: '5px',
  margin: 'auto',
  display: 'flex',
  alignSelf: 'center',
  textAlign: 'center',
  justifyContent: 'center',
  whiteSpace: 'nowrap',
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
      },
    },
    {
      props: { isDisabled: true },
      style: {
        background: 'rgba(9, 30, 66, 0.04)',
        color: 'rgba(9, 30, 66, 0.08)',
        border: 'none',
        cursor: 'not-allowed',
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
});

type BoardPageBackgroundProps = {
  background?: string;
};

export const BoardPageBackground = styled('div')<BoardPageBackgroundProps>({
  height: '100vh',
  width: 'max-content',
  minWidth: '100vw',
  display: 'flex',
  variants: [
    {
      props: { background: 'blue' },
      style: { background: '#0079bf' },
    },
    {
      props: { background: 'default' },
      style: { background: 'rgba(0,0,0,0.1)' },
    },
  ],
  background: 'transparent',
});

export const NavBarContainer = styled('div')<{
  background: 'blue' | 'default';
}>({
  fontFamily:
    '-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Noto Sans,Ubuntu,Droid Sans,Helvetica Neue,sans-serif;',
  width: '100vw',
  position: 'sticky',
  height: '40px',
  zIndex: 1,
  variants: [
    {
      props: { background: 'blue' },
      style: {
        background: '#0079bf',
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'default' },
      style: { background: 'rgba(0,0,0,0.1)' },
    },
  ],
  display: 'flex',
  justifyContent: 'space-around',
  color: 'white',
});

export const LogOutText = styled.div` 
  position: absolute;
  right: 15px;
  top: 25%;
  cursor: pointer;
`;
