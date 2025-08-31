import { useMemo } from 'react';
import type { ColumnSpec, YearRow } from '../types';

function formatCell(row: YearRow, key: string): string | number {
  if (key === 'year') return row.year;
  const v = row[key];
  if (v === undefined || v === null || Number.isNaN(v)) return 'N/A';
  if (typeof v === 'number') {
    if (Math.abs(v) >= 1000) return Math.round(v).toLocaleString();
    return Number(v.toFixed(3));
  }
  return String(v);
}

export function useFormattedRow(row: YearRow, headers: ColumnSpec[]) {
  return useMemo(() => {
    const res: Record<string, string | number> = {};
    for (const h of headers) {
      res[h.key] = formatCell(row, h.key);
    }
    return res;
  }, [row, headers]);
}
