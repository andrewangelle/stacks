import { useEffect, useRef } from 'react';
import { afterCrossContainerDrop } from './dnd';

export type CrossGroupMoveArgs = {
  itemId: string;
  sourceGroupId: string;
  targetGroupId: string;
  fromIndex: number;
  toIndex: number;
  element: HTMLDivElement | null;
};

type OnMoveCallback = (args: CrossGroupMoveArgs) => void;

export function useCrossContainerMove(cb: OnMoveCallback) {
  const ref = useRef<HTMLDivElement>(null);
  const callbackRef = useRef<OnMoveCallback>(cb);

  useEffect(() => {
    callbackRef.current = cb;
  });

  return {
    ref,
    onMove(args: CrossGroupMoveArgs) {
      afterCrossContainerDrop({
        element: args.element,
        sourceContainer: ref.current,
        fromIndex: args.fromIndex,
        applyMove: () => callbackRef.current(args),
      });
    },
  };
}
