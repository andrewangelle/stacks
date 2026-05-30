import type { ReactNode } from 'react';

export type DraggableProps = {
  type: 'list' | 'card' | 'checklistItem';
  children: ReactNode;
};

export function Draggable(props: DraggableProps) {
  return props.children;
}
