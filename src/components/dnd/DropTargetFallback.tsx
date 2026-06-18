import { useDragDropMonitor, useDroppable } from '@dnd-kit/react';
import type { CSSProperties } from 'react';
import { useMemo, useState } from 'react';

type DropTargetFallbackProps = {
  id: string;
  type: 'card' | 'checklistItem';
};

const baseStyles = {
  width: '100%',
  minHeight: 1,
  flexShrink: 0,
};

const dropTargetStyles = {
  backgroundColor: 'rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
};

/**
 * Drop target at the bottom of a list or checklist.
 *
 * When a container has no items — or the user drops below the last item — collision
 * detection needs a droppable here, otherwise cross-container drags have nowhere to land.
 * The id prefix (`list-drop:` / `checklist-drop:`) is parsed in Draggable.handleDragEnd
 * to route the drop to onMove with the correct target container.
 */

export function DropTargetFallback({ id, type }: DropTargetFallbackProps) {
  const { ref } = useDroppable({
    id,
    type,
    accept: type,
  });

  const [styles, setStyles] = useState<CSSProperties>(baseStyles);
  const stylesMemod = useMemo(() => styles, [styles]);

  useDragDropMonitor({
    onDragOver(event) {
      const { target } = event.operation;
      const isActive = target?.id === id;

      // show fallback when dragging over an empty container
      if (isActive) {
        setStyles((prev) => ({
          ...prev,
          ...dropTargetStyles,
          height: type === 'card' ? '30px' : '40px',
        }));
      } else {
        // reset when the pointer leaves
        setStyles(baseStyles);
      }
    },

    onDragEnd(event) {
      // reset after drop
      const { target } = event.operation;
      const isActive = target?.id === id;
      if (isActive) {
        setStyles(baseStyles);
      }
    },
  });

  return <div ref={ref} aria-hidden style={stylesMemod} />;
}
