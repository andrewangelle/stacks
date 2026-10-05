import { useRef } from 'react';

export function useSelectTriggerRef() {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return {
    ref: triggerRef,
    onCloseAutoFocus(event: Event) {
      // Radix returns focus to the trigger synchronously, before this
      // Select's own `hideOthers` cleanup un-hides it (both fire on
      // unmount, but FocusScope's runs first) — that transient overlap
      // makes the browser block the focus and log an aria-hidden
      // warning. Defer the refocus a frame so the cleanup has landed.
      event.preventDefault();
      requestAnimationFrame(() => {
        triggerRef.current?.focus({ preventScroll: true });
      });
    },
  };
}
