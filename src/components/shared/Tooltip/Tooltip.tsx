import { Tooltip as TooltipPrimitive } from 'radix-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import * as styles from '~/components/shared/Tooltip/Tooltip.css';

type TooltipProps = {
  portal?: boolean;
  disabled?: boolean;
  content: ReactNode;
  children: ReactNode;
};

export function Tooltip({
  portal = true,
  disabled,
  content,
  children,
}: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <TooltipPrimitive.Provider delayDuration={250}>
      <TooltipPrimitive.Root
        open={isOpen}
        onOpenChange={(nextIsOpen) => !disabled && setIsOpen(nextIsOpen)}
      >
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        {portal && (
          <TooltipPrimitive.Portal>
            <TooltipPrimitive.Content
              className={styles.tooltipContent}
              side="bottom"
              sideOffset={8}
            >
              {content}
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}

        {!portal && (
          <TooltipPrimitive.Content
            className={styles.tooltipContent}
            side="bottom"
            sideOffset={8}
          >
            {content}
          </TooltipPrimitive.Content>
        )}
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
