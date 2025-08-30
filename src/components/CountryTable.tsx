import { memo, useMemo } from 'react';
import type { ColumnSpec, YearRow } from '../types';

interface Props {
  data: YearRow[];
  selectedCols: ColumnSpec[];
  highlightYear: number;
}

function CountryTableImpl({ data, selectedCols, highlightYear }: Props) {
  const headers = useMemo(() => selectedCols, [selectedCols]);

  return (
    <div className="mt-3 max-h-72 overflow-auto rounded-xl border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 backdrop-blur-xl">
          <tr>
            {headers.map((c) => (
              <th
                key={c.key}
                className="text-left px-3 py-2 border-b whitespace-nowrap"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.year}
              className={row.year === highlightYear ? 'animate-flash' : ''}
            >
              {headers.map((c) => (
                <td key={c.key} className="px-3 py-1 border-b tabular-nums">
                  {formatCell(row, c.key)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

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

export const CountryTable = memo(CountryTableImpl);
