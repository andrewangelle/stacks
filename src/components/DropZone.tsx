import { useDroppable } from '@dnd-kit/react';

type DropZoneProps = {
  id: string;
  type: 'card' | 'checklistItem';
};

/**
 * Invisible drop target at the bottom of a list or checklist.
 *
 * When a container has no items — or the user drops below the last item — collision
 * detection needs a droppable here, otherwise cross-container drags have nowhere to land.
 * The id prefix (`list-drop:` / `checklist-drop:`) is parsed in Draggable.handleDragEnd
 * to route the drop to onMove with the correct target container.
 *
 * No onDrop handler here: the dragged item's Draggable owns dragEnd and calls onMove.
 */
export function DropZone({ id, type }: DropZoneProps) {
  const { ref } = useDroppable({
    id,
    type,
    accept: type,
  });

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ width: '100%', minHeight: 1, flexShrink: 0 }}
    />
  );
}
