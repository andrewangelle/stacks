import {
  type MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

export function useOutsideClick<ElementType = HTMLDivElement>(
  handler: (e: MouseEvent<ElementType>) => void,
  when = true,
) {
  const savedHandler = useRef(handler);

  const [node, setNode] = useState<Element | null>(null);

  const memoizedCallback = useCallback(
    (e: globalThis.MouseEvent) => {
      if (node && !node.contains(e.target as Element)) {
        savedHandler.current(e as unknown as MouseEvent<ElementType>);
      }
    },
    [node],
  );

  useEffect(() => {
    savedHandler.current = handler;
  });

  const ref = useCallback((node: HTMLElement | null) => {
    setNode(node);
  }, []);

  useEffect(() => {
    if (when) {
      document.addEventListener('click', memoizedCallback);
    }
    return () => {
      document.removeEventListener('click', memoizedCallback);
    };
  }, [when, memoizedCallback]);

  return ref;
}
