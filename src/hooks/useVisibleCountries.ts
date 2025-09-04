import { useMemo } from 'react';
import type { CountryEntry, SortKey } from '../types';

export function useVisibleCountries(
  filteredCountries: CountryEntry[],
  sortBy: SortKey,
  year: number
) {
  return useMemo(() => {
    const arr = [...filteredCountries];

    let key = sortBy as string;
    let asc = true;

    if (sortBy.endsWith('_asc')) {
      key = sortBy.slice(0, -4);
      asc = true;
    } else if (sortBy.endsWith('_desc')) {
      key = sortBy.slice(0, -5);
      asc = false;
    }

    return arr.sort((a, b) => {
      if (key === 'name') {
        return asc
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }
      const aRow = a.data.find((r) => r.year === year) || {};
      const bRow = b.data.find((r) => r.year === year) || {};
      const aVal = aRow[key as keyof typeof aRow];
      const bVal = bRow[key as keyof typeof bRow];

      const aNum = typeof aVal === 'number' ? aVal : 0;
      const bNum = typeof bVal === 'number' ? bVal : 0;

      return asc ? aNum - bNum : bNum - aNum;
    });
  }, [filteredCountries, sortBy, year]);
}
