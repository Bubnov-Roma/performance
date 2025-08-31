import { useState, useCallback, useMemo } from 'react';

export function useVirtualList<T>(
  data: T[],
  rowHeight: number,
  viewportHeight: number
) {
  const [scrollTop, setScrollTop] = useState(0);

  const onScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const visibleCount = Math.ceil(viewportHeight / rowHeight);
  const startIndex = Math.floor(scrollTop / rowHeight);
  const endIndex = Math.min(startIndex + visibleCount + 5, data.length);

  const visibleData = useMemo(
    () => data.slice(startIndex, endIndex),
    [data, startIndex, endIndex]
  );

  const paddingTop = startIndex * rowHeight;
  const paddingBottom = (data.length - endIndex) * rowHeight;

  return { visibleData, paddingTop, paddingBottom, onScroll };
}
