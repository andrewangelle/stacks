import { Portal, Provider, Root, Trigger } from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { TooltipContent } from '~/components/Tooltip/Tooltip.styled';

export function Tooltip({
  portal = true,
  trigger,
  disabled,
  children,
}: {
  portal?: boolean;
  disabled?: boolean;
  trigger: ReactNode;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Provider>
      <Root
        open={isOpen}
        onOpenChange={(nextIsOpen) => !disabled && setIsOpen(nextIsOpen)}
      >
        <Trigger asChild>{trigger}</Trigger>
        {portal && (
          <Portal>
            <TooltipContent side="bottom" sideOffset={8}>
              {children}
            </TooltipContent>
          </Portal>
        )}
        {!portal && (
          <TooltipContent side="bottom" sideOffset={8}>
            {children}
          </TooltipContent>
        )}
      </Root>
    </Provider>
  );
}
