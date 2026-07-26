import { Tooltip as TooltipPrimitive } from 'radix-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { TooltipContent } from '~/components/shared/Tooltip/Tooltip.styled';

type TooltipProps = {
  disabled?: boolean;
  content: ReactNode;
  children: ReactNode;
};

export function Tooltip({ disabled, content, children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root
        open={isOpen}
        onOpenChange={(nextIsOpen) => !disabled && setIsOpen(nextIsOpen)}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>

        <TooltipPrimitive.Portal>
          <TooltipContent side="bottom" sideOffset={8}>
            {content}
          </TooltipContent>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
