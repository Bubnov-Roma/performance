import { memo, useDeferredValue } from 'react';
import type { ColumnSpec, YearRow } from '../types';
import { useFormattedRow } from '../hooks/useFormattedRow';

interface Props {
  row: YearRow;
  headers: ColumnSpec[];
  highlightYear: number;
  rowHeight: number;
}

function CardTableRowImpl({ row, headers, highlightYear, rowHeight }: Props) {
  const formatted = useFormattedRow(row, headers);
  const deferredHighlight = useDeferredValue(highlightYear);
  const isHighlighted = row.year === deferredHighlight;

  return (
    <tr
      style={{ height: rowHeight }}
      className={isHighlighted ? 'animate-flash' : undefined}
    >
      {headers.map((c) => (
        <td key={c.key} className="px-3 py-1 border-b tabular-nums">
          {formatted[c.key]}
        </td>
      ))}
    </tr>
  );
}

export const CardTableRow = memo(
  CardTableRowImpl,
  (prev, next) =>
    prev.row === next.row &&
    prev.highlightYear === next.highlightYear &&
    prev.headers === next.headers
);
