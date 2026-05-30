import type { Card } from '@prisma/client';
import { type ReactNode, type RefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragCardShadow } from '~/components/Cards/CardModal.styled';
import { ListCardSkeleton } from '~/components/Lists/List.styled';
import { reorderCards, useGetCardById } from '~/query/cards';

type DragDropCardProps = {
  id: string;
  children: ReactNode;
};

export function DragDropCard({ id, children }: DragDropCardProps) {
  const { data: card, isLoading } = useGetCardById({ id });

  const [{ isDragging }, dragRef] = useDrag({
    type: 'listCard',
    item: { id, name: card?.cardTitle },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: 'listCard',
    drop: (item: Card) => reorderCards(item, card?.listId ?? '', id),
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

  if (isLoading) {
    return <ListCardSkeleton />;
  }

  if (isRef(dragDropRef)) {
    return (
      <div ref={dragDropRef}>
        {!isDragging && children}
        {isDragging && (
          <DragCardShadow
            height={rect?.height}
            width={rect?.width}
            data-testid="DragCardShadow"
            key={id}
          />
        )}
      </div>
    );
  }

  return null;
}
