import { Tooltip as TooltipPrimitive } from 'radix-ui';
import type { ReactNode } from 'react';
import { useState } from 'react';
import * as styles from '~/components/shared/Tooltip/Tooltip.css';

type TooltipProps = {
  disabled?: boolean;
  content: ReactNode;
  children: ReactNode;
};

// The content must stay portaled. Rendered inline it unmounts next to the
// trigger on blur, which aborts the browser's in-flight Tab navigation and
// strands focus — inside a dialog that means Tab never gets past the trigger.
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
          <TooltipPrimitive.Content
            className={styles.tooltipContent}
            side="bottom"
            sideOffset={8}
          >
            {content}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  );
}
