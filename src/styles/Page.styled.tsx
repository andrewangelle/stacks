import { Link } from '@tanstack/react-router';
import { Popover } from 'radix-ui';
import type { ReactNode } from 'react';
import * as styles from '~/styles/Page.css';
import { styledEl } from '~/styles/styledEl';

type PaddingProps = {
  padding: string;
  children: ReactNode;
};

export function Padding({ padding, children }: PaddingProps) {
  return <div style={{ padding }}>{children}</div>;
}

export const Center = styledEl('div', styles.center);

export const FlexColumn = styledEl('div', styles.flexColumn);

export const Flex = styledEl('div', styles.flex);

export const FlexCenter = styledEl('div', styles.flexCenter);

export type ButtonExtraProps = {
  secondary?: boolean;
};

/**
 * `secondary` is a legacy no-op flag carried by call sites; it selects nothing
 * and must be kept off the DOM. Every button built from the shared base goes
 * through here so the strip list stays in one place.
 */
export function buttonEl(className: string) {
  return styledEl<'button', ButtonExtraProps>('button', className, [
    'secondary',
  ]);
}

export const Button = buttonEl(styles.button);

export const LogoLink = styledEl(Link, styles.logoLink);

export const LogoIconSlot = styledEl('span', styles.logoIconSlot);

export const PopoverOptionsContent = styledEl(
  Popover.Content,
  styles.popoverOptionsContent,
);

export const PopoverOptionsContentContainer = styledEl(
  'div',
  styles.popoverOptionsContentContainer,
);
