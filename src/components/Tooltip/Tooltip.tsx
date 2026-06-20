import { Portal, Provider, Root, Trigger } from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { TooltipContent } from '~/components/Tooltip/Tooltip.styled';

export function Tooltip({
  portal = true,
  disabled,
  content,
  children,
}: {
  portal?: boolean;
  disabled?: boolean;
  content: ReactNode;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Provider>
      <Root
        open={isOpen}
        onOpenChange={(nextIsOpen) => !disabled && setIsOpen(nextIsOpen)}
      >
        <Trigger asChild>{children}</Trigger>
        {portal && (
          <Portal>
            <TooltipContent side="bottom" sideOffset={8}>
              {content}
            </TooltipContent>
          </Portal>
        )}

        {!portal && (
          <TooltipContent side="bottom" sideOffset={8}>
            {content}
          </TooltipContent>
        )}
      </Root>
    </Provider>
  );
}
