import { PropsWithChildren, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";
import { useParams } from "remix";

import { List, reorderLists } from "~/store";

export function DragDropList({ 
  id, 
  listTitle, 
  children 
}: PropsWithChildren<{
  id: string; 
  listTitle: string
}>){
  const params = useParams();
  const dispatch = useDispatch();
  const [,dragRef] = useDrag({
    type: 'list',
    item: { id, name: listTitle },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop({
    accept: 'list',
    drop: (item, ...args) => dispatch(
      reorderLists(item as List, params.id!, id)
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
