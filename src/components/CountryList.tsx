import { memo } from 'react';
import type { ColumnSpec, CountryEntry } from '../types';
import { CountryCard } from './CountryCard';

interface Props {
  countries: CountryEntry[];
  selectedCols: ColumnSpec[];
  highlightYear: number;
}

function CountryListImpl({ countries, selectedCols, highlightYear }: Props) {
  return (
    <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {countries.map((c) => (
        <CountryCard
          key={c.code}
          country={c}
          selectedCols={selectedCols}
          highlightYear={highlightYear}
        />
      ))}
    </section>
  );
}

export const CountryList = memo(CountryListImpl);
