import { useMemo, useState } from 'react';
import type { ColumnSpec, CountryEntry, SortKey } from '../types';
import { useDataWorker } from './useDataWorker';

export interface AppState {
  search: string;
  setSearch: (v: string) => void;
  year: number;
  setYear: (y: number) => void;
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
  regionsSelected: string[];
  setRegionsSelected: (r: string[]) => void;
  regions: string[];
  regionLabel: string;
  selectedCols: ColumnSpec[];
  setSelectedCols: (cols: ColumnSpec[]) => void;
  visibleCountries: CountryEntry[];
  minYear: number;
  maxYear: number;
  years: number[];
  loading: boolean;
  runWorker: () => void;
}

export function useAppState(all: CountryEntry[]): AppState {
  const { minYear, maxYear, years } = useMemo(() => {
    const yearSet = new Set<number>();
    let min = Infinity;
    let max = -Infinity;
    for (const c of all) {
      for (const r of c.data) {
        if (typeof r.year === 'number') {
          yearSet.add(r.year);
          if (r.year < min) min = r.year;
          if (r.year > max) max = r.year;
        }
      }
    }
    return { minYear: min, maxYear: max, years: Array.from(yearSet).sort() };
  }, [all]);

  const [search, setSearch] = useState('');
  const [year, setYear] = useState<number>(maxYear);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [regionsSelected, setRegionsSelected] = useState<string[]>(['All']);
  const [selectedCols, setSelectedCols] = useState<ColumnSpec[]>([
    { key: 'year', label: 'Year' },
    { key: 'population', label: 'Population' },
    { key: 'co2', label: 'CO₂' },
    { key: 'co2_per_capita', label: 'CO₂ per capita' },
  ]);

  const regions = useMemo(() => {
    const s = new Set<string>(['All']);
    for (const c of all) {
      if (!c.iso) s.add(c.name);
    }
    return Array.from(s).sort();
  }, [all]);

  const regionLabel = useMemo(() => {
    if (regionsSelected.length === 0 || regionsSelected.includes('All')) {
      const rest = regionsSelected.filter((r) => r !== 'All');
      return rest.length ? `All + ${rest.join(' + ')}` : 'All Regions';
    }
    if (regionsSelected.length === 1) return regionsSelected[0];
    if (regionsSelected.length === 2)
      return `${regionsSelected[0]} + ${regionsSelected[1]}`;
    return `${regionsSelected[0]} + ${regionsSelected[1]} + ${
      regionsSelected.length - 2
    } more`;
  }, [regionsSelected]);

  const {
    result: filteredCountries,
    loading,
    runWorker,
  } = useDataWorker(all, search, regionsSelected);

  const visibleCountries = useMemo(() => {
    const arr = [...filteredCountries];
    switch (sortBy) {
      case 'name':
        return arr.sort((a, b) => a.name.localeCompare(b.name));
      case 'name_desc':
        return arr.sort((a, b) => b.name.localeCompare(a.name));
      case 'population':
        return arr.sort(
          (a, b) =>
            (b.data.find((r) => r.year === year)?.population ?? 0) -
            (a.data.find((r) => r.year === year)?.population ?? 0)
        );
      case 'population_asc':
        return arr.sort(
          (a, b) =>
            (a.data.find((r) => r.year === year)?.population ?? 0) -
            (b.data.find((r) => r.year === year)?.population ?? 0)
        );
      default:
        return arr;
    }
  }, [filteredCountries, sortBy, year]);

  return {
    search,
    setSearch,
    year,
    setYear,
    sortBy,
    setSortBy,
    regionsSelected,
    setRegionsSelected,
    regions,
    regionLabel,
    selectedCols,
    setSelectedCols,
    visibleCountries,
    minYear,
    maxYear,
    years,
    loading,
    runWorker,
  };
}
