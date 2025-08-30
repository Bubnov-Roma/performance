import { useMemo, useState } from 'react';
import type { ColumnSpec, CountryEntry, SortKey, YearRow } from '../types';

export interface AppState {
  search: string;
  setSearch: (v: string) => void;
  year: number;
  setYear: (y: number) => void;
  sortBy: SortKey;
  setSortBy: (s: SortKey) => void;
  region: string;
  setRegion: (r: string) => void;
  selectedCols: ColumnSpec[];
  setSelectedCols: (cols: ColumnSpec[]) => void;
  visibleCountries: CountryEntry[];
  regions: string[];
  minYear: number;
  maxYear: number;
}

function extractRegionFromRow(r: YearRow): string | undefined {
  const tryKeys = ['continent', 'region', 'world_6region'];
  for (const k of tryKeys) {
    const v = r[k];
    if (typeof v === 'string' && v.trim().length > 0) return v;
  }
  return undefined;
}

export function useAppState(all: CountryEntry[]): AppState {
  const { minYear, maxYear } = useMemo(() => {
    let min = Number.POSITIVE_INFINITY;
    let max = Number.NEGATIVE_INFINITY;
    for (const c of all) {
      for (const r of c.data) {
        if (typeof r.year === 'number') {
          if (r.year < min) min = r.year;
          if (r.year > max) max = r.year;
        }
      }
    }
    if (!Number.isFinite(min)) min = 1900;
    if (!Number.isFinite(max)) max = 2020;
    return { minYear: min, maxYear: max };
  }, [all]);

  const [search, setSearch] = useState('');
  const [year, setYear] = useState<number>(maxYear);
  const [sortBy, setSortBy] = useState<SortKey>('name');
  const [region, setRegion] = useState<string>('All');
  const [selectedCols, setSelectedCols] = useState<ColumnSpec[]>([
    { key: 'year', label: 'Year' },
    { key: 'population', label: 'Population' },
    { key: 'co2', label: 'CO₂' },
    { key: 'co2_per_capita', label: 'CO₂ per capita' },
  ]);

  const regions = useMemo(() => {
    const s = new Set<string>(['All']);
    for (const c of all) {
      let best: YearRow | undefined;
      let bestDelta = Number.POSITIVE_INFINITY;
      for (const r of c.data) {
        const d = Math.abs(r.year - year);
        if (d < bestDelta) {
          best = r;
          bestDelta = d;
        }
      }
      const reg = best ? extractRegionFromRow(best) : undefined;
      if (reg) s.add(reg);
    }
    return Array.from(s).sort();
  }, [all, year]);

  const visibleCountries = useMemo(() => {
    const needle = search.trim().toLowerCase();
    const filtered = all.filter((c) => {
      const byRegion =
        region === 'All' ||
        c.data.some((r) => extractRegionFromRow(r) === region);
      const byName =
        needle.length === 0 || c.name.toLowerCase().includes(needle);
      return byRegion && byName;
    });

    if (sortBy === 'name') {
      return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    }

    return [...filtered].sort((a, b) => {
      const pa = a.data.find((r) => r.year === year)?.population ?? 0;
      const pb = b.data.find((r) => r.year === year)?.population ?? 0;
      return pb - pa;
    });
  }, [all, search, region, sortBy, year]);

  return {
    search,
    setSearch,
    year,
    setYear,
    sortBy,
    setSortBy,
    region,
    setRegion,
    selectedCols,
    setSelectedCols,
    visibleCountries,
    regions,
    minYear,
    maxYear,
  };
}
