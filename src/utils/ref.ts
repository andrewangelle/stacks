import type { Ref } from 'react';

export function assignRef<RefType>(
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
