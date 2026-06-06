import type { DragEndEvent } from '@dnd-kit/react';
import {
  PointerSensor,
  useDragDropMonitor,
  useDraggable,
  useDroppable,
} from '@dnd-kit/react';
import type { ReactNode } from 'react';
import { useCallback, useMemo } from 'react';

export type DraggableProps = {
  id: string;
  name: string;
  type: 'list' | 'card' | 'checklistItem';
  onDrop: (...args: unknown[]) => void;
  children: ReactNode;
};

const cardPointerSensor = PointerSensor.configure({
  preventActivation(event, source) {
    const { target } = event;

    if (target === source.element || target === source.handle) {
      return false;
    }

    if (target instanceof Element && source.element?.contains(target)) {
      return false;
    }

    return true;
  },
});

export function Draggable({
  type,
  id,
  name,
  onDrop,
  children,
}: DraggableProps) {
  const itemData = useMemo(() => ({ id, name }), [id, name]);

  const { ref: draggableRef } = useDraggable({
    id,
    type,
    data: itemData,
    sensors: type === 'card' ? [cardPointerSensor] : undefined,
  });

  const { ref: droppableRef } = useDroppable({
    id,
    type,
    accept: type,
  });

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      draggableRef(node);
      droppableRef(node);
    },
    [draggableRef, droppableRef],
  );

  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      if (event.canceled) return;

      const { source, target } = event.operation;
      if (!source || !target || target.id !== id) return;
      if (source.id === id) return;

      onDrop(source.data);
    },
    [id, onDrop],
  );

  useDragDropMonitor(
    useMemo(() => ({ onDragEnd: handleDragEnd }), [handleDragEnd]),
  );

  // Cards/checklist items live in vertical columns and should fill the column
  // width. Lists live in the board's horizontal row and must hug their own
  // width, otherwise each list stretches to an equal flex share of the row and
  // leaves large gaps between them.
  const isColumnItem = type !== 'list';

  return (
    // tabIndex/role suppress @dnd-kit's keyboard-drag activator so the only
    // focusable target per item is the content's own trigger.
    //
    // The dragged element itself is promoted to the top layer by @dnd-kit as
    // the drag preview (so it keeps its real content), while a placeholder
    // clone is left in place and styled as a shadow via global drag styles.
    <div
      ref={setRef}
      role="presentation"
      style={{
        minWidth: 0,
        width: isColumnItem ? '100%' : 'max-content',
      }}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
