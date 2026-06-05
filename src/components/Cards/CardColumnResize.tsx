import { type PointerEvent, useRef } from 'react';
import { ResizeableCardColumnHandle } from '~/components/Cards/Card.styled';
import {
  ACTIVITY_COLUMN_MAX_WIDTH,
  ACTIVITY_COLUMN_MIN_WIDTH,
} from '~/utils/useCardColumnWidth';

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
    <ResizeableCardColumnHandle
      data-testid="ResizeableCardColumnHandle"
      onPointerDown={initializePointer}
      onPointerMove={resizeColumnWidth}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
    />
  );
}
