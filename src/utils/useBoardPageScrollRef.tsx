import {
  createContext,
  type ReactNode,
  type RefObject,
  type TouchEvent,
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
  const lastTouchXRef = useRef(0);

  return {
    onWheel(event: WheelEvent) {
      if (scrollRef.current) {
        scrollRef.current.scrollLeft += event.deltaX || event.deltaY;
      }
    },
    onTouchStart(event: TouchEvent) {
      lastTouchXRef.current = event.touches[0].clientX;
    },
    onTouchMove(event: TouchEvent) {
      if (scrollRef.current && event.touches.length > 0) {
        const currentX = event.touches[0].clientX;
        scrollRef.current.scrollLeft += lastTouchXRef.current - currentX;
        lastTouchXRef.current = currentX;
      }
    },
  };
}
