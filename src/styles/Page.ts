import type {
  ButtonHTMLAttributes,
  ComponentType,
  HTMLAttributes,
} from 'react';
import { blue } from '~/styles/Boards';
import { styled } from '~/styles/styled';

export const Padding: ComponentType<
  HTMLAttributes<HTMLDivElement> & { padding: string }
> = styled('div')`
  padding: ${(props: { padding: string }) => props.padding};
`;

export const Center = styled('div')` 
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const FlexColumn = styled('div')` 
  display: flex;
  flex-direction: column;
  margin: 10px auto;
`;

export const Flex = styled('div')` 
  display: flex;
`;

export const Button: ComponentType<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    isDisabled?: boolean;
    secondary?: boolean;
  }
> = styled('button')`
  background: ${(props: { isDisabled?: boolean }) =>
    props.isDisabled ? 'rgba(9, 30, 66, 0.04)' : blue};
  color: ${(props: { isDisabled?: boolean }) =>
    props.isDisabled ? 'rgba(9, 30, 66, 0.08)' : '#fff'};
  border: none;
  border-radius: 5px;
  margin: auto;
  display: flex;
  align-self: center;
  text-align: center;
  justify-content: center;
  cursor: pointer;
  white-space: nowrap;

  ${(props: { disabled?: boolean }) => {
    if (props.disabled) {
      return `
        background: grey;
        cursor: not-allowed;
      `;
    }
  }}

  ${(props: { secondary?: boolean }) => {
    if (props.secondary) {
      return `
        background: rgba(9, 30, 66, 0.04);
        border: 1px solid ${blue};
        color: ${blue}
      `;
    }
  }}
`;

export const BoardPageBackground: ComponentType<
  HTMLAttributes<HTMLDivElement> & { background?: string }
> = styled('div')`
  height: 100vh;
  width: max-content;
  min-width: 100vw;
  background: ${(props: { background?: string }) => props.background};
  display: flex;
`;
