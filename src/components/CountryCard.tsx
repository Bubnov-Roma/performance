import { memo, useMemo } from 'react';
import type { ColumnSpec, CountryEntry, YearRow } from '../types';
import { CountryTable } from './CountryTable';

interface Props {
  country: CountryEntry;
  selectedCols: ColumnSpec[];
  highlightYear: number;
}

function CountryCardImpl({ country, selectedCols, highlightYear }: Props) {
  const latestRow = useMemo<YearRow | undefined>(
    () => country.data.find((r) => r.year === highlightYear),
    [country.data, highlightYear]
  );
  return (
    <article className="bg-[var(--card)] rounded-2xl border shadow p-4">
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
      <CountryTable
        data={country.data}
        selectedCols={selectedCols}
        highlightYear={highlightYear}
      />
    </article>
  );
}

export const CountryCard = memo(CountryCardImpl);
