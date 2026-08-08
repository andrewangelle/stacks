import { Link } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import type { ReactNode } from 'react';
import { css, type DataAttributes, styled } from 'styled-components';
import { blue, fontFamily } from '~/styles/tokens';

type PaddingProps = {
  padding: string;
  children: ReactNode;
};

export function Padding({ padding, children }: PaddingProps) {
  return <div style={{ padding }}>{children}</div>;
}

export const Center = styled.div.attrs<DataAttributes>({
  'data-testid': 'Center',
})` 
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

export const Flex = styled.div.attrs<DataAttributes>({
  'data-testid': 'Flex',
})` 
  display: flex;
`;

export const FlexCenter = styled.div.attrs<DataAttributes>({
  'data-testid': 'FlexCenter',
})`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

`;

type ButtonExtraProps = {
  $secondary?: boolean;
};

export const secondaryButtonColor = 'rgba(9, 30, 66, 0.9)';

export const secondaryButtonStyles = css`
  background: transparent;
  color: ${secondaryButtonColor};
  border: 1px solid rgba(9, 30, 66, 0.2);
  cursor: pointer;
  font-weight: 600;

  &:hover {
    background: rgba(9, 30, 66, 0.04);
    color: ${secondaryButtonColor};
  }
`;

export const Button = styled.button<ButtonExtraProps>`
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  white-space: nowrap;

  /* applies hover effect to the button */
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: #000;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease;
  }

  &:hover:not(:disabled)::before {
    opacity: 0.1;
  }

  &:disabled {
    background: rgba(9, 30, 66, 0.02);
    color: rgba(9, 30, 66, 0.2);
    border: 1px solid rgba(9, 30, 66, 0.2);
    cursor: not-allowed;
  }

  ${({ $secondary }) =>
    $secondary
      ? secondaryButtonStyles
      : css`
          background: ${blue};
          color: #fff;
          border: none;
          cursor: pointer;

          &:hover:not(:disabled) {
            color: white;
          }
        `}
`;

export const LogoLink = styled(Link).attrs<DataAttributes>({
  'data-testid': 'LogoLink',
})`
  text-decoration: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: unset;
`;

export const LogoIconSlot = styled.span.attrs<DataAttributes>({
  'data-testid': 'LogoSpinner',
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
`;

export const PopoverOptionsContent = styled(
  Popover.Content,
).attrs<DataAttributes>({
  'data-testid': 'PopoverOptionsContent',
})` 
  position: relative;
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
  z-index: 3;
`;

export const PopoverOptionsContentContainer = styled.div`
  padding: 0px 10px;
`;
