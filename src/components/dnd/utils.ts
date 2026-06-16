import type { Droppable } from '@dnd-kit/dom';
import { PointerSensor } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import type { DraggableProps } from '~/components/dnd/Draggable';

export const preventParentActivationOnNestedDraggables =
  PointerSensor.configure({
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

export const preventActivationOnNestedSortableChildren =
  PointerSensor.configure({
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

export const preventChecklistItemControlActivation = PointerSensor.configure({
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

export function getSensors(type: DraggableProps['type']) {
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

// biome-ignore lint/suspicious/noExplicitAny: <>
type Data = Record<string, any>;

export function getTargetSortableGroup<DataType extends Data>(
  target: Droppable<DataType> | null,
  id: string,
) {
  if (target && isSortable(target) && target.id !== id) {
    return String(target.sortable.group);
  }

  return null;
}

export function dropZoneGroupId(targetId: string) {
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

export function getTargetDropZoneGroup<DataType extends Data>(
  target: Droppable<DataType> | null,
) {
  if (target && !isSortable(target)) {
    return dropZoneGroupId(String(target.id));
  }

  return null;
}

export function getDraggableTestId(type: DraggableProps['type']) {
  if (type === 'card') {
    return 'DraggableCard';
  }

  if (type === 'checklistItem') {
    return 'DraggableChecklistItem';
  }

  return undefined;
}
