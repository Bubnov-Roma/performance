import { memo, useMemo, useDeferredValue } from 'react';
import type { ColumnSpec, CountryEntry } from '../types';
import { CardTable } from './CardTable';

interface Props {
  country: CountryEntry;
  selectedCols: ColumnSpec[];
  highlightYear: number;
  yearOrderDesc: boolean;
  isLocallyOverridden: boolean;
  onToggleLocalYearOrder: () => void;
}

function CountryCardImpl({
  country,
  selectedCols,
  highlightYear,
  yearOrderDesc,
  isLocallyOverridden,
  onToggleLocalYearOrder,
}: Props) {
  const deferredHighlight = useDeferredValue(highlightYear);

  const latestRow = useMemo(
    () => country.data.find((r) => r.year === deferredHighlight),
    [country.data, deferredHighlight]
  );

  return (
    <article className="bg-[var(--card)] rounded-2xl border shadow p-4 max-w-full overflow-hidden">
      <header className="flex items-baseline justify-between gap-2">
        <h2 className="font-semibold text-lg truncate" title={country.name}>
          {country.name}
        </h2>
        <span className="text-xs text-gray-500">
          {country.iso ?? country.code}
        </span>
      </header>
      <dl className="mt-1 grid grid-cols-3 gap-2 text-sm">
        <div className="col-span-2">
          <dt className="text-[var(--muted)]">Population</dt>
          <dd className={`tabular-nums ${latestRow ? 'animate-flash' : ''}`}>
            {latestRow?.population ?? 'N/A'}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--muted)]">Year</dt>
          <dd className={`tabular-nums ${latestRow ? 'animate-flash' : ''}`}>
            {latestRow?.year ?? '—'}
          </dd>
        </div>
      </dl>
      <div className="mt-3 overflow-x-auto">
        <CardTable
          data={country.data}
          selectedCols={selectedCols}
          highlightYear={highlightYear}
          yearOrderDesc={yearOrderDesc}
          isLocallyOverridden={isLocallyOverridden}
          onToggleLocalYearOrder={onToggleLocalYearOrder}
        />
      </div>
    </article>
  );
}

export const CountryCard = memo(CountryCardImpl);
