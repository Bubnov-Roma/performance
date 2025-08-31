import { memo, useMemo } from 'react';
import type { ColumnSpec, YearRow } from '../types';
import { useVirtualList } from '../hooks/useVirtualList';
import { CountryTableRow } from './CountryTableRow';

interface Props {
  data: YearRow[];
  selectedCols: ColumnSpec[];
  highlightYear: number;
}

const ROW_HEIGHT = 29;
const VIEWPORT_HEIGHT = 300;

function CountryTableImpl({ data, selectedCols, highlightYear }: Props) {
  const headers = useMemo(() => selectedCols, [selectedCols]);

  const { visibleData, paddingTop, paddingBottom, onScroll } = useVirtualList(
    data,
    ROW_HEIGHT,
    VIEWPORT_HEIGHT
  );

  return (
    <div
      className="mt-3 overflow-auto rounded-xl border"
      style={{ height: VIEWPORT_HEIGHT }}
      onScroll={onScroll}
    >
      <table className="w-full text-sm border-collapse">
        <thead className="sticky top-0 backdrop-blur-3xl z-10">
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
          {paddingTop > 0 && (
            <tr style={{ height: paddingTop }}>
              <td colSpan={headers.length} />
            </tr>
          )}

          {visibleData.map((row) => (
            <CountryTableRow
              key={row.year}
              row={row}
              headers={headers}
              highlightYear={highlightYear}
              rowHeight={ROW_HEIGHT}
            />
          ))}

          {paddingBottom > 0 && (
            <tr style={{ height: paddingBottom }}>
              <td colSpan={headers.length} />
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export const CountryTable = memo(CountryTableImpl);
