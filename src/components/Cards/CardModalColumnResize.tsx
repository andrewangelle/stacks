import { useEffect, useRef } from 'react';
import { CardModalResizeHandle } from '~/components/Cards/CardModal.styled';

export const ACTIVITY_COLUMN_DEFAULT_WIDTH = 350;
export const CARD_MODAL_WIDE_LAYOUT_QUERY = '(min-width: 851px)';
const ACTIVITY_COLUMN_MIN_WIDTH = 300;
const ACTIVITY_COLUMN_MAX_WIDTH = 480;

type CardModalColumnResizeProps = {
  columnWidth: number;
  setColumnWidth: (width: number) => void;
  setIsWideLayout: (isWideLayout: boolean) => void;
};

export function CardModalColumnResize({
  columnWidth,
  setColumnWidth,
  setIsWideLayout,
}: CardModalColumnResizeProps) {
  const isResizingRef = useRef(false);
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(columnWidth);

  function handleResizePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    isResizingRef.current = true;
    resizeStartXRef.current = event.clientX;
    resizeStartWidthRef.current = columnWidth;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function handleResizePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isResizingRef.current) {
      return;
    }

    const deltaX = resizeStartXRef.current - event.clientX;

    setColumnWidth(
      clampActivityColumnWidth(resizeStartWidthRef.current + deltaX),
    );
  }

  function clampActivityColumnWidth(width: number) {
    return Math.min(
      ACTIVITY_COLUMN_MAX_WIDTH,
      Math.max(ACTIVITY_COLUMN_MIN_WIDTH, width),
    );
  }

  function handleResizePointerUp(event: React.PointerEvent<HTMLDivElement>) {
    isResizingRef.current = false;
    event.currentTarget.releasePointerCapture(event.pointerId);
  }

  useEffect(() => {
    const mediaQuery = window.matchMedia(CARD_MODAL_WIDE_LAYOUT_QUERY);
    const onChange = () => setIsWideLayout(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, [setIsWideLayout]);

  return (
    <CardModalResizeHandle
      data-testid="CardModalResizeHandle"
      onPointerDown={handleResizePointerDown}
      onPointerMove={handleResizePointerMove}
      onPointerUp={handleResizePointerUp}
      onPointerCancel={handleResizePointerUp}
    />
  );
}
