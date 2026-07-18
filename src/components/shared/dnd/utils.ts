import type { Droppable } from '@dnd-kit/dom';
import { PointerSensor } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import type { DraggableProps } from '~/components/shared/dnd/Draggable';

export function getSensors(type: DraggableProps['type']) {
  if (type === 'card') {
    return [preventListActivation];
  }

  if (type === 'list' || type === 'checklist') {
    return [preventCardOrChecklistItemActivation];
  }

  if (type === 'checklistItem') {
    return [preventCheckboxActivation];
  }

  return undefined;
}

const preventListActivation = PointerSensor.configure({
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

const preventCardOrChecklistItemActivation = PointerSensor.configure({
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

const preventCheckboxActivation = PointerSensor.configure({
  preventActivation(event, source) {
    const { target } = event;

    if (target === source.element || target === source.handle) {
      return false;
    }

    if (target instanceof Element && source.element?.contains(target)) {
      if (
        target.closest(
          '[data-testid="CheckboxRoot"], [data-testid="DeleteChecklistItemButton"], [data-testid="ConvertChecklistItemToCardButton"]',
        )
      ) {
        return true;
      }

      return false;
    }

    return true;
  },
});

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

export function dropTargetFallbackGroupId(targetId: string) {
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
    return dropTargetFallbackGroupId(String(target.id));
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
