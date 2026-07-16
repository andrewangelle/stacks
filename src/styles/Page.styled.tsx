import { styled } from '@pigment-css/react';
import { Link } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import type { ReactNode } from 'react';
import { blue, fontFamily } from '~/styles/tokens';

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

export const LogoIconSlot = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
`;

export const PopoverOptionsContent = styled(Popover.Content)` 
  width: 304px;
  border-radius: 8px; 
  font-family: ${fontFamily};
  font-size: 14px;
  background: #fff;
  display: flex;
  flex-direction: column;
  z-index: 1;
  box-shadow: 0px 8px 12px #1E1F2126, 0px 0px 1px #1E1F214F;
  padding: 10px 0px;
`;

export const PopoverOptionsContentContainer = styled.div`
  padding: 0px 10px;
`;
