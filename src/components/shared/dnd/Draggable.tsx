import { Feedback } from '@dnd-kit/dom';
import { isSortable } from '@dnd-kit/dom/sortable';
import { useDragDropMonitor } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import type { ReactNode } from 'react';
import { useCallback, useMemo, useRef } from 'react';
import {
  getDraggableTestId,
  getSensors,
  getTargetDropZoneGroup,
  getTargetSortableGroup,
} from '~/components/shared/dnd/utils';
import { assignRef } from '~/utils/ref';
import type { CrossGroupMoveArgs } from '~/utils/useCrossContainerMove';

export type DraggableSource = {
  id: string;
  name: string;
  parentId: string;
};

export type DraggableProps = {
  id: string;
  name: string;
  type: 'list' | 'card' | 'checklist' | 'checklistItem';
  parentId?: string;
  index: number;
  group: string;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onMove?: (args: CrossGroupMoveArgs) => void;
  children: ReactNode;
};

export function Draggable({
  type,
  id,
  name,
  parentId = '',
  index,
  group,
  onReorder,
  onMove,
  children,
}: DraggableProps) {
  const elementRef = useRef<HTMLDivElement>(null);

  const itemData = useMemo(
    (): DraggableSource => ({ id, name, parentId }),
    [id, name, parentId],
  );

  const { ref: sortableRef } = useSortable({
    id,
    type,
    index,
    group,
    data: itemData,
    accept: type,
    sensors: getSensors(type),
    plugins(defaults) {
      return [...defaults, Feedback.configure({ dropAnimation: null })];
    },
  });

  const setRef = useCallback(
    (node: HTMLDivElement | null) => {
      assignRef(sortableRef, node);
      elementRef.current = node;
    },
    [sortableRef],
  );

  useDragDropMonitor({
    onDragEnd(event) {
      if (event.canceled) return;

      const { source, target } = event.operation;

      if (!source || !isSortable(source) || source.id !== id) {
        return;
      }

      const {
        initialIndex,
        index: newIndex,
        initialGroup,
        group: currentGroup,
      } = source.sortable;

      const element = elementRef.current;
      const targetSortableGroup = getTargetSortableGroup(target, id);
      const targetDropZoneGroup = getTargetDropZoneGroup(target);

      if (
        // We'll hit this case after a cross-container move
        // if dnd-kit didn't update the source's group metadata.
        initialGroup === currentGroup
      ) {
        if (
          // dropped on another *item* in a different container,
          onMove &&
          targetSortableGroup &&
          targetSortableGroup !== String(initialGroup) &&
          target &&
          isSortable(target)
        ) {
          onMove({
            itemId: id,
            sourceGroupId: String(initialGroup),
            targetGroupId: targetSortableGroup,
            fromIndex: initialIndex,
            toIndex: target.sortable.index,
            element,
          });
          return;
        }

        if (
          // dropped on a *dropzone* in a different container,
          onMove &&
          targetDropZoneGroup &&
          targetDropZoneGroup !== String(initialGroup)
        ) {
          onMove({
            itemId: id,
            sourceGroupId: String(initialGroup),
            targetGroupId: targetDropZoneGroup,
            fromIndex: initialIndex,
            toIndex: newIndex,
            element,
          });
          return;
        }

        // dropped on the same position
        if (initialIndex === newIndex) {
          return;
        }

        // dropped in the same container
        onReorder(initialIndex, newIndex);
        return;
      }

      // cross-container move
      if (onMove) {
        onMove({
          itemId: id,
          sourceGroupId: String(initialGroup),
          targetGroupId: String(currentGroup),
          fromIndex: initialIndex,
          toIndex: newIndex,
          element,
        });
      }
    },
  });

  const isColumnItem = type !== 'list';

  return (
    <div
      ref={setRef}
      role="presentation"
      data-testid={getDraggableTestId(type)}
      style={{
        minWidth: 0,
        width: isColumnItem ? '100%' : 'max-content',
      }}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}
