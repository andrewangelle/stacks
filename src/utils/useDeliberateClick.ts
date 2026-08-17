import { type MouseEvent, type PointerEvent, useRef } from 'react';

/** Pointer travel a click may carry before it reads as a drag, in pixels. */
const DRAG_THRESHOLD = 4;

/**
 * Read-only text that doubles as an edit trigger has to tell a click apart
 * from a selection gesture: the browser fires `click` on mouse up either way,
 * so a drag that selects a paragraph would otherwise open the editor and throw
 * the selection away.
 *
 * Two gestures are held back:
 *
 * - a press that travelled, which is the drag that made the selection;
 * - a press that started while text was already selected, which is the click
 *   that clears it. `pointerdown` runs before the browser collapses the
 *   selection, so the old selection is still readable here.
 *
 * Spread the returned handlers onto the element the click should open.
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
