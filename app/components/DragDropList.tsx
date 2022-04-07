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
  const [{isDragging}, dragRef] = useDrag({
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
            margin: '0 15px',
            borderRadius: '5px'
          }}
        />
      )}
    </div>
  )
}
