import type { ReactNode, RefObject } from 'react';
import { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DraggingItemShadow } from '~/styles/Page.styled';

export type DraggableProps = {
  id: string;
  name: string;
  type: 'list' | 'card' | 'checklistItem';
  onDrop: (...args: unknown[]) => void;
  children: ReactNode;
};

export function Draggable({
  type,
  id,
  name,
  onDrop,
  children,
}: DraggableProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type,
    item: { id, name },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: type,
    drop: onDrop,
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
      const rect = child?.getBoundingClientRect();
      return rect;
    }
  }

  const rect = getRect();

  if (isRef(dragDropRef)) {
    return (
      <div ref={dragDropRef}>
        {!isDragging && children}
        {isDragging && (
          <DraggingItemShadow
            data-testid="DraggingItemShadow"
            height={rect?.height}
            width={rect?.width}
          />
        )}
      </div>
    );
  }

  return null;
}
