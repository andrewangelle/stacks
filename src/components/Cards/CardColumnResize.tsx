import { type PointerEvent, useRef } from 'react';
import { ResizeableCardColumnHandle } from '~/components/Cards/Card.styled';
import {
  ACTIVITY_COLUMN_MAX_WIDTH,
  ACTIVITY_COLUMN_MIN_WIDTH,
} from '~/hooks/useCardColumnWidth';

type CardColumnResizeProps = {
  columnWidth: number;
  setColumnWidth: (width: number) => void;
  isResizing: boolean;
  setIsResizing: (isResizing: boolean) => void;
  visible: boolean;
};

export function CardColumnResize({
  columnWidth,
  setColumnWidth,
  isResizing,
  setIsResizing,
  visible,
}: CardColumnResizeProps) {
  const resizeStartXRef = useRef(0);
  const resizeStartWidthRef = useRef(columnWidth);

  function initializePointer(event: PointerEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsResizing(true);
    resizeStartXRef.current = event.clientX;
    resizeStartWidthRef.current = columnWidth;
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function resizeColumnWidth(event: PointerEvent<HTMLDivElement>) {
    if (!isResizing) {
      return;
    }

    const deltaX = resizeStartXRef.current - event.clientX;

    setColumnWidth(clamp(resizeStartWidthRef.current + deltaX));
  }

  function releasePointer(event: PointerEvent<HTMLDivElement>) {
    setIsResizing(false);
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
      $visible={visible}
      onPointerDown={initializePointer}
      onPointerMove={resizeColumnWidth}
      onPointerUp={releasePointer}
      onPointerCancel={releasePointer}
    />
  );
}
