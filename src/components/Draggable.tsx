import { Feedback } from '@dnd-kit/dom';
import { isSortable } from '@dnd-kit/dom/sortable';
import { PointerSensor, useDragDropMonitor } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import type { ReactNode } from 'react';
import { useMemo } from 'react';

export type DraggableProps = {
  id: string;
  name: string;
  type: 'list' | 'card' | 'checklist' | 'checklistItem';
  index: number;
  group: string;
  onReorder: (fromIndex: number, toIndex: number) => void;
  children: ReactNode;
};

const preventParentActivationOnNestedDraggables = PointerSensor.configure({
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
  index,
  group,
  onReorder,
  children,
}: DraggableProps) {
  const itemData = useMemo(() => ({ id, name }), [id, name]);

  const { ref } = useSortable({
    id,
    type,
    index,
    group,
    data: itemData,
    accept: type,
    sensors: getSensors(),
    plugins(defaults) {
      return [...defaults, Feedback.configure({ dropAnimation: null })];
    },
  });

  function getSensors() {
    if (type === 'card' || type === 'checklist') {
      return [preventParentActivationOnNestedDraggables];
    }
    return undefined;
  }

  // Restrict the drag end event to only the matching targets
  useDragDropMonitor(
    useMemo(
      () => ({
        onDragEnd(event) {
          if (event.canceled) return;

          const { source } = event.operation;
          if (!source || source.id !== id || !isSortable(source)) {
            return;
          }

          const {
            initialIndex,
            index: newIndex,
            group: itemGroup,
          } = source.sortable;

          if (itemGroup !== group || initialIndex === newIndex) {
            return;
          }

          onReorder(initialIndex, newIndex);
        },
      }),
      [id, group, onReorder],
    ),
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
      ref={ref}
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
