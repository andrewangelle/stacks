import type { ChecklistItem } from '@prisma/client';
import { type ReactNode, type RefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragChecklistItemShadow } from '~/components/Checklists/Checklists.styled';
import { reorderChecklistItems } from '~/query/checklistItems';

type DragDropChecklistItemProps = {
  id: string;
  label: string;
  checklistId: string;
  children: ReactNode;
};

export function DragDropChecklistItem({
  id,
  label,
  checklistId,
  children,
}: DragDropChecklistItemProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'checklistItem',
    item: { id, name: label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'checklistItem',
    drop: (item, ..._args) =>
      reorderChecklistItems(item as ChecklistItem, checklistId, id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = useRef<HTMLDivElement | null>(null);
  const dragDropRef = dragRef(dropRef(ref));

  function isRef(el: unknown): el is RefObject<HTMLDivElement> {
    return typeof el === 'object' && el !== null && 'current' in el;
  }

  function getRect() {
    if (isRef(dragDropRef) && dragDropRef.current) {
      const child = dragDropRef.current.firstChild as HTMLElement;
      const rect = child.getBoundingClientRect();
      return rect;
    }
  }

  const rect = getRect();

  if (isRef(dragDropRef)) {
    return (
      <div ref={dragDropRef}>
        {!isDragging && children}
        {isDragging && (
          <DragChecklistItemShadow
            height={rect?.height}
            width={rect?.width}
            data-testid="DragChecklistItemShadow"
            key={id}
          />
        )}
      </div>
    );
  }

  return null;
}
