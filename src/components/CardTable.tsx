import { memo, useMemo } from 'react';
import type { ColumnSpec, YearRow } from '../types';
import { useVirtualTable } from '../hooks/useVirtualTable';
import { CardTableRow } from './CardTableRow';

interface Props {
  data: YearRow[];
  selectedCols: ColumnSpec[];
  highlightYear: number;
  yearOrderDesc: boolean;
  isLocallyOverridden: boolean;
  onToggleLocalYearOrder: () => void;
}

const ROW_HEIGHT = 29;
const VIEWPORT_HEIGHT = 300;

function CardTableImpl({
  data,
  selectedCols,
  highlightYear,
  yearOrderDesc,
  isLocallyOverridden,
  onToggleLocalYearOrder,
}: Props) {
  const headers = useMemo(() => selectedCols, [selectedCols]);

  const sortedData = useMemo(() => {
    if (yearOrderDesc) return [...data].sort((a, b) => a.year - b.year);
    return [...data].sort((a, b) => b.year - a.year);
  }, [data, yearOrderDesc]);

  const { visibleIndexes, paddingTop, paddingBottom, onScroll } =
    useVirtualTable(sortedData, ROW_HEIGHT, VIEWPORT_HEIGHT);

  return (
    <div
      className="overflow-auto border"
      style={{ height: VIEWPORT_HEIGHT }}
      onScroll={onScroll}
    >
      <table className="min-w-full text-sm border-collapse">
        <thead
          className={`filter sticky top-0 backdrop-blur-3xl ${isLocallyOverridden && 'invert'}`}
        >
          <tr>
            {headers.map((c) => (
              <th
                key={c.key}
                className="text-left px-3 py-2 border-b whitespace-nowrap"
              >
                {c.key === 'year' ? (
                  <button
                    onClick={onToggleLocalYearOrder}
                    className="flex items-center gap-1 font-semibold border-none p-0"
                  >
                    Year {yearOrderDesc ? '↓' : '↑'}
                  </button>
                ) : (
                  c.label
                )}
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
          {visibleIndexes.map((i) => (
            <CardTableRow
              key={sortedData[i].year}
              row={sortedData[i]}
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

export const CardTable = memo(CardTableImpl);
