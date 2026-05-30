import type { List } from '@prisma/client';
import { type ReactNode, type RefObject, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { DragListShadow } from '~/components/Lists/List.styled';
import { reorderLists } from '~/query/lists';
import { useCurrentBoardId } from '~/utils/useCurrentBoardId';

type DragDropListProps = {
  id: string;
  listTitle: string;
  children: ReactNode;
};

export function DragDropList({ id, listTitle, children }: DragDropListProps) {
  const boardId = useCurrentBoardId();
  const [{ isDragging }, dragRef] = useDrag({
    type: 'list',
    item: { id, name: listTitle },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop<List>({
    accept: 'list',
    drop: (item, ..._args) => reorderLists(item, boardId, id),
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
          <DragListShadow
            height={rect?.height}
            width={rect?.width}
            data-testid="DragListShadow"
            key={id}
          />
        )}
      </div>
    );
  }

  return null;
}
