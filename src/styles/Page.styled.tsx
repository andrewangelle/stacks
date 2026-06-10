import { styled } from '@pigment-css/react';
import { Link } from '@tanstack/react-router';
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

export const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

`;

type ButtonExtraProps = {
  secondary?: boolean;
};

export const secondaryButtonStyles = {
  background: 'transparent',
  color: 'rgba(9, 30, 66, 0.9)',
  border: '1px solid rgba(9, 30, 66, 0.2)',
  cursor: 'pointer',
  fontWeight: 600,

  '&:hover': {
    background: 'rgba(9, 30, 66, 0.04)',
    color: 'rgba(9, 30, 66, 0.9)',
  },
};

export const Button = styled('button')<ButtonExtraProps>({
  position: 'relative',
  overflow: 'hidden',
  borderRadius: '8px',
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

  '&:disabled': {
    background: 'rgba(9, 30, 66, 0.02)',
    color: 'rgba(9, 30, 66, 0.2)',
    border: '1px solid rgba(9, 30, 66, 0.2)',
    cursor: 'not-allowed',
  },

  background: `${blue}`,
  color: '#fff',
  border: 'none',
  cursor: 'pointer',

  '&:hover:not(:disabled)': {
    color: 'white',
  },
});

export const LogoLink = styled(Link)({
  textDecoration: 'none',
  color: 'white',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  minHeight: 'unset',
});
