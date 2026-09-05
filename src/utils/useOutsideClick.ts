import { type MouseEvent, useEffect, useRef, useState } from 'react';

export function useOutsideClick<ElementType = HTMLDivElement>(
  handler: (e: MouseEvent<ElementType>) => void,
  when = true,
) {
  const savedHandler = useRef(handler);

  const [node, setNode] = useState<Element | null>(null);

  function memoizedCallback(e: globalThis.MouseEvent) {
    if (node && !node.contains(e.target as Element)) {
      savedHandler.current(e as unknown as MouseEvent<ElementType>);
    }
  }

  useEffect(() => {
    savedHandler.current = handler;
  });

  function ref(node: HTMLElement | null) {
    setNode(node);
  }

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (when) {
      timeoutId = setTimeout(() => {
        document.addEventListener('click', memoizedCallback);
      }, 0);
    }
    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', memoizedCallback);
    };
    // biome-ignore lint/correctness/useExhaustiveDependencies:<react compiler>
  }, [when, memoizedCallback]);

  return ref;
}
