import type { YearRow } from '../types';

const formatCache = new Map<string, string | number>();

export function formatCell(row: YearRow, key: keyof YearRow): string | number {
  const val = row[key];
  const cacheKey = `${key}:${String(val)}`;

  const cached = formatCache.get(cacheKey);
  if (cached !== undefined) return cached;

  let result: string | number;
  if (key === 'year') {
    result = row.year;
  } else if (val === undefined || val === null || Number.isNaN(val)) {
    result = 'N/A';
  } else if (typeof val === 'number') {
    result =
      Math.abs(val) >= 1000
        ? Math.round(val).toLocaleString()
        : Number(val.toFixed(3));
  } else {
    result = String(val);
  }

  formatCache.set(cacheKey, result);
  return result;
}
