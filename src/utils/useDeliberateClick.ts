import { type MouseEvent, type PointerEvent, useRef } from 'react';

/** Pointer travel a click may carry before it reads as a drag, in pixels. */
const DRAG_THRESHOLD = 4;

/**
 * Text in a container that doubles as an edit trigger has to tell a click apart
 * from a selection gesture.
 *
 * Two things are determined:
 * - a drag that made the selection;
 * - a click that started while text was already selected, in order to clear that selection.
 */
export function useDeliberateClick(onClick: () => void) {
  const pressOrigin = useRef<{ x: number; y: number } | null>(null);
  const pressClearedSelection = useRef(false);

  function handlePointerDown(event: PointerEvent<HTMLElement>) {
    pressOrigin.current = { x: event.clientX, y: event.clientY };
    pressClearedSelection.current = hasSelectedText();
  }

  function handleClick(event: MouseEvent<HTMLElement>) {
    const origin = pressOrigin.current;
    pressOrigin.current = null;

    const travel = origin
      ? Math.hypot(event.clientX - origin.x, event.clientY - origin.y)
      : 0;

    if (travel > DRAG_THRESHOLD || pressClearedSelection.current) {
      return;
    }

    onClick();
  }

  return { onPointerDown: handlePointerDown, onClick: handleClick };
}

function hasSelectedText() {
  const selection = window.getSelection();

  return selection !== null && !selection.isCollapsed;
}
