import type { KeyboardEvent } from 'react';

export function onEnter(
  save: (input: HTMLInputElement | HTMLTextAreaElement) => void,
) {
  return (event: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (
      event.key !== 'Enter' ||
      event.shiftKey ||
      event.nativeEvent.isComposing
    ) {
      return;
    }
    event.preventDefault();
    if (event.currentTarget.value.trim()) {
      save(event.currentTarget);
    }
  };
}
