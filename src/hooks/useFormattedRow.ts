import { useMemo } from 'react';
import type { YearRow, ColumnSpec } from '../types';
import { formatCell } from '../utils/formatCell';

export function useFormattedRow(row: YearRow, headers: ColumnSpec[]) {
  return useMemo(() => {
    const formatted: Record<string, string | number> = {};
    for (const h of headers) {
      formatted[h.key] = formatCell(row, h.key as keyof YearRow);
    }
    return formatted;
  }, [row, headers]);
}
