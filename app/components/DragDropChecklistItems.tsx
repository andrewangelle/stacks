import { PropsWithChildren, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useDispatch } from "react-redux";

import { ChecklistItemType, reorderChecklistItems } from "~/store";

export function DragDropChecklistItem({ 
  id, 
  label,
  checklistId,
  children 
}: PropsWithChildren<{
  id: string;
  checklistId: string,
  label: string
}>){
  const dispatch = useDispatch();
  const [,dragRef] = useDrag({
    type: 'checklistItem',
    item: { id, name: label },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })

  const [, dropRef] = useDrop({
    accept: 'checklistItem',
    drop: (item, ...args) => dispatch(
      reorderChecklistItems(item as ChecklistItemType, checklistId, id)
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
