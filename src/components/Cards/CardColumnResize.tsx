import { type PointerEvent, useEffect, useRef, useState } from 'react';
import { ResizeableCardColumn } from '~/components/Cards/Card.styled';

export const ACTIVITY_COLUMN_DEFAULT_WIDTH = 350;
export const CARD_MODAL_WIDE_LAYOUT_QUERY = '(min-width: 851px)';
const ACTIVITY_COLUMN_MIN_WIDTH = 300;
const ACTIVITY_COLUMN_MAX_WIDTH = 480;

type CardColumnResizeProps = {
  columnWidth: number;
  setColumnWidth: (width: number) => void;
};

export function CardColumnResize({
  columnWidth,
  setColumnWidth,
}: CardColumnResizeProps) {
  const isResizingRef = useRef(false);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(columnWidth);

  function initializePointer(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    isResizingRef.current = true;
    resizeStartXRef.current = event.clientX;
    resizeStartWidthRef.current = columnWidth;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function resizeColumnWidth(event: PointerEvent<HTMLDivElement>) {
    if (!isResizingRef.current) {
      return;
    }

    const deltaX = resizeStartXRef.current - event.clientX;

    setColumnWidth(clamp(resizeStartWidthRef.current + deltaX));
  }

  function releasePointer(event: PointerEvent<HTMLDivElement>) {
    isResizingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  function clamp(width: number) {
    return Math.min(
      ACTIVITY_COLUMN_MAX_WIDTH,
      Math.max(ACTIVITY_COLUMN_MIN_WIDTH, width),
    );
  }

  return (
    <ResizeableCardColumn
      data-testid="ResizeableCardColumn"
      onPointerDown={initializePointer}
      onPointerMove={resizeColumnWidth}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
    />
  );
}

export function useCardColumnWidth() {
  const [columnWidth, setColumnWidth] = useState(ACTIVITY_COLUMN_DEFAULT_WIDTH);
  const [isWideLayout, setIsWideLayout] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia(CARD_MODAL_WIDE_LAYOUT_QUERY).matches
      : false,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(CARD_MODAL_WIDE_LAYOUT_QUERY);
    const syncWideLayout = () => setIsWideLayout(mediaQuery.matches);
    syncWideLayout();
    mediaQuery.addEventListener('change', syncWideLayout);
    return () => mediaQuery.removeEventListener('change', syncWideLayout);
  }, []);

  return { columnWidth, setColumnWidth, isWideLayout };
}
