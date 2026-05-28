import type { Card } from '@prisma/client';
import { type ReactNode, type RefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { reorderCards } from '~/query/cards';

type DragDropCardProps = {
  id: string;
  listId: string;
  cardTitle: string;
  children: ReactNode;
};

export function DragDropCard({
  id,
  listId,
  cardTitle,
  children,
}: DragDropCardProps) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'listCard',
    item: { id, name: cardTitle },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'listCard',
    drop: (item: Card) => reorderCards(item, listId, id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  const ref = useRef<HTMLDivElement | null>(null);

  const dragDropRef = dragRef(
    dropRef(ref),
  ) as unknown as RefObject<HTMLDivElement | null>;

  const firstChild = (Boolean(dragDropRef.current?.firstChild) &&
    dragDropRef.current?.firstChild) as HTMLElement;

  const rect = firstChild && (firstChild.getBoundingClientRect() as DOMRect);

  return (
    <div ref={dragDropRef}>
      {!isDragging && children}
      {isDragging && (
        <div
          style={{
            height: rect.height,
            width: rect.width,
            background: 'rgba(0,0,0,0.1)',
            margin: '4px auto',
            borderRadius: '5px',
          }}
        />
      )}
    </div>
  );
}
