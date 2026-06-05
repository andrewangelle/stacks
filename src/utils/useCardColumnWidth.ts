import { useEffect, useState } from 'react';

export const ACTIVITY_COLUMN_DEFAULT_WIDTH = 350;
export const CARD_MODAL_WIDE_LAYOUT_QUERY = '(min-width: 851px)';
export const ACTIVITY_COLUMN_MIN_WIDTH = 300;
export const ACTIVITY_COLUMN_MAX_WIDTH = 480;

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
