import { styled } from '@pigment-css/react';
import type { ReactNode } from 'react';
import type { BackgroundProps } from '~/styles/Boards';
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
  background: 'transparent',
  variants: [
    {
      props: { background: 'blue' },
      style: { background: '#0079bf' },
    },
    {
      props: { background: 'green' },
      style: { background: '#519839' },
    },
    {
      props: { background: 'lightGreen' },
      style: { background: '#4bbf6b' },
    },
    {
      props: { background: 'orange' },
      style: { background: '#d29034' },
    },
    {
      props: { background: 'red' },
      style: { background: '#b04632' },
    },
  ],
});

export const NavBarContainer = styled('div')<BackgroundProps>({
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
      props: { background: 'green' },
      style: {
        background: '#519839',
        borderBottom: '1px solid white',
      },
    },
    {
      props: { background: 'lightGreen' },
      style: { background: '#4bbf6b', borderBottom: '1px solid white' },
    },
    {
      props: { background: 'orange' },
      style: { background: '#d29034', borderBottom: '1px solid white' },
    },
    {
      props: { background: 'red' },
      style: { background: '#b04632', borderBottom: '1px solid white' },
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
