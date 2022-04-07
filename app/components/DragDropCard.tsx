import { PropsWithChildren, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";

import { reorderCards, ListCardType } from "~/store";

export function DragDropCard({ 
  id, 
  listId, 
  cardTitle,
  children 
}: PropsWithChildren<{
  id: string; 
  listId: string;
  cardTitle: string;
}>){
  const dispatch = useDispatch();
  const [{ isDragging }, dragRef] = useDrag({
    type: 'listCard',
    item: { id, name: cardTitle },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop({
    accept: 'listCard',
    drop: (item, ...args) => dispatch(
      reorderCards(item as ListCardType, listId, id)
    ),
    collect: (monitor) => ({
      isOver: monitor.isOver()
    })
  })

  const ref = useRef<HTMLDivElement | null>(null);
  const dragDropRef = dragRef(dropRef(ref)) as unknown as React.MutableRefObject<HTMLDivElement | null>
  const firstChild = (
    Boolean(dragDropRef.current && dragDropRef.current?.firstChild) &&  dragDropRef.current?.firstChild!
  ) as HTMLElement
  const rect = firstChild && firstChild.getBoundingClientRect() as DOMRect
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
            borderRadius: '5px'
          }}
        />
      )}
    </div>
  )
}
