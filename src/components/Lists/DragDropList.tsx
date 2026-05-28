import type { List } from '@prisma/client';
import { useParams } from '@tanstack/react-router';
import { type ReactNode, type RefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { reorderLists } from '~/query/lists';

type DragDropListProps = {
  id: string;
  listTitle: string;
  children: ReactNode;
};

export function DragDropList({ id, listTitle, children }: DragDropListProps) {
  const params = useParams({ strict: false });
  const [{ isDragging }, dragRef] = useDrag({
    type: 'list',
    item: { id, name: listTitle },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop<List>({
    accept: 'list',
    drop: (item, ..._args) => reorderLists(item, params.id ?? '', id),
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
            margin: '0 15px',
            borderRadius: '5px',
          }}
        />
      )}
    </div>
  );
}
