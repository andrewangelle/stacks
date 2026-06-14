import { Feedback } from '@dnd-kit/dom';
import { isSortable } from '@dnd-kit/dom/sortable';
import { PointerSensor, useDragDropMonitor } from '@dnd-kit/react';
import { useSortable } from '@dnd-kit/react/sortable';
import type { ReactNode, Ref } from 'react';
import { useCallback, useMemo, useRef } from 'react';

export type DraggableSource = {
  id: string;
  name: string;
  /** listId or checklistId — used to identify the source container on cross-container drop. */
  parentId: string;
};

export type CrossGroupMoveArgs = {
  itemId: string;
  sourceGroupId: string;
  targetGroupId: string;
  fromIndex: number;
  toIndex: number;
  /** Wrapper div for this draggable; needed to revert DOM before cache update (see crossContainerDragDom.ts). */
  element: HTMLDivElement | null;
};

export type DraggableProps = {
  id: string;
  name: string;
  type: 'list' | 'card' | 'checklist' | 'checklistItem';
  parentId?: string;
  index: number;
  group: string;
  /** Within the same list/checklist column. */
  onReorder: (fromIndex: number, toIndex: number) => void;
  /** Across lists or checklists (cards: same board; items: same card only). */
  onMove?: (args: CrossGroupMoveArgs) => void;
  children: ReactNode;
};

const preventParentActivationOnNestedDraggables = PointerSensor.configure({
  preventActivation(event, source) {
    const { target } = event;

    if (target === source.element || target === source.handle) {
      return false;
    }

    if (target instanceof Element && source.element?.contains(target)) {
      return false;
    }

    return true;
  },
});

// Lists and checklists wrap cards/items. Without this, clicking a card would start
// dragging the whole column because the parent sortable's sensor would activate first.
const preventActivationOnNestedSortableChildren = PointerSensor.configure({
  preventActivation(event, source) {
    const { target } = event;

    if (target === source.element || target === source.handle) {
      return false;
    }

    if (!(target instanceof Element) || !source.element?.contains(target)) {
      return true;
    }

    if (target.closest('[data-testid="DraggableCard"]')) {
      return true;
    }

    if (target.closest('[data-testid="DraggableChecklistItem"]')) {
      return true;
    }

    return false;
  },
});

const preventChecklistItemControlActivation = PointerSensor.configure({
  preventActivation(event, source) {
    const { target } = event;

    if (target === source.element || target === source.handle) {
      return false;
    }

    if (target instanceof Element && source.element?.contains(target)) {
      if (
        target.closest(
          '[data-testid="CheckboxRoot"], [data-testid="DeleteChecklistPopoverTrigger"]',
        )
      ) {
        return true;
      }

      return false;
    }

    return true;
  },
});

function getSensors(type: DraggableProps['type']) {
  if (type === 'card') {
    return [preventParentActivationOnNestedDraggables];
  }

  if (type === 'list' || type === 'checklist') {
    return [preventActivationOnNestedSortableChildren];
  }

  if (type === 'checklistItem') {
    return [preventChecklistItemControlActivation];
  }

  return undefined;
}

function assignRef<RefType>(
  ref: Ref<RefType> | undefined,
  value: RefType | null,
) {
  if (typeof ref === 'function') {
    ref(value);
    return;
  }

  if (ref) {
    ref.current = value;
  }
}

function dropZoneGroupId(targetId: string) {
  // DropZone ids are prefixed so Draggable can tell an empty-container target
  // apart from a sortable item target (see handleDragEnd below).
  if (targetId.startsWith('list-drop:')) {
    return targetId.slice('list-drop:'.length);
  }

  if (targetId.startsWith('checklist-drop:')) {
    return targetId.slice('checklist-drop:'.length);
  }

  return null;
}

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
  // Kept alongside @dnd-kit's sortable ref so onMove can pass the wrapper node
  // back to the parent list/checklist for DOM revert before cache update.
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

      const targetSortableGroup =
        target && isSortable(target) && target.id !== id
          ? String(target.sortable.group)
          : null;

      const targetDropZoneGroup =
        target && !isSortable(target)
          ? dropZoneGroupId(String(target.id))
          : null;

      // Same-group reorder vs cross-container move:
      //
      // • Same group, different index → onReorder (within-container; cache only).
      // • Same group on paper but dropped on a sibling in another list/checklist,
      //   or on an empty-container DropZone → onMove.
      // • Sortable group changed during drag (OptimisticSortingPlugin moved the item
      //   into the target container for previews) → onMove with initial/current group.
      //
      // parentId on item data is the source container id; group on useSortable is the
      // sortable group (also listId / checklistId for cards and items).
      if (initialGroup === currentGroup) {
        if (
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

        if (initialIndex === newIndex) {
          return;
        }

        onReorder(initialIndex, newIndex);
        return;
      }

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
      data-testid={
        type === 'card'
          ? 'DraggableCard'
          : type === 'checklistItem'
            ? 'DraggableChecklistItem'
            : undefined
      }
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
