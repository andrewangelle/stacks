import { useEffect, useRef } from 'react';

export function usePrevious<DataType>(state: DataType): DataType | undefined {
  const ref = useRef<DataType>(undefined);

  useEffect(() => {
    ref.current = state;
  });

  return ref.current;
}
