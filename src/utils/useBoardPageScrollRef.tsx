import {
  createContext,
  type ReactNode,
  type RefObject,
  useContext,
  useRef,
  type WheelEvent,
} from 'react';

const BoardPageScrollRefContext = createContext<RefObject<HTMLElement | null>>({
  current: null,
});

export function BoardPageScrollRefProvider({
  children,
}: {
  children: ReactNode;
}) {
  const scrollRef = useRef<HTMLElement | null>(null);

  function monitorRef(node: HTMLDivElement | null) {
    if (node) {
      let element: HTMLElement | null = node.parentElement;
      while (element) {
        const { overflowX } = getComputedStyle(element);
        if (overflowX === 'auto' || overflowX === 'scroll') {
          scrollRef.current = element;
          return;
        }
        element = element.parentElement;
      }
    }
  }

  return (
    <BoardPageScrollRefContext.Provider value={scrollRef}>
      <span ref={monitorRef} hidden />
      {children}
    </BoardPageScrollRefContext.Provider>
  );
}

export function useBoardScrollRef() {
  return useContext(BoardPageScrollRefContext);
}

export function useBoardPageScrollHandler() {
  const scrollRef = useBoardScrollRef();
  return (event: WheelEvent) => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft += event.deltaX || event.deltaY;
    }
  };
}
