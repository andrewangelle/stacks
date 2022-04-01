import { PropsWithChildren, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";

import { reorderCards } from "~/store";
import { ListCardType } from "~/components";

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
  const [, dragRef] = useDrag({
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

  return (
    <div ref={dragDropRef}>
      {children}
    </div>
  )
}
