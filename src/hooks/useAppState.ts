import {
  useMemo,
  useState,
  useDeferredValue,
  useTransition,
  useCallback,
} from 'react';
import type { ColumnSpec, CountryEntry, SortKey } from '../types';
import { useDataWorker } from './useDataWorker';
import { useVisibleCountries } from './useVisibleCountries';
import { generateSortOptions } from '../utils/sortOptions';

interface AppState {
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
  isPending: boolean;
  yearOrderDesc: boolean;
  onToggleYearOrder: () => void;
  localOverrides: Record<string, boolean | undefined>;
  toggleLocalOverride: (code: string) => void;
  resetLocalOverrides: () => void;
  sortOptions: { value: SortKey; label: string }[];
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
    return {
      minYear: min,
      maxYear: max,
      years: Array.from(yearSet).sort((a, b) => b - a),
    };
  }, [all]);

  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);

  const [year, _setYear] = useState<number>(maxYear);
  const [sortBy, _setSortBy] = useState<SortKey>('name_asc');
  const [regionsSelected, _setRegionsSelected] = useState<string[]>(['All']);
  const [yearOrderDesc, setYearOrderDesc] = useState(false);
  const [selectedCols, _setSelectedCols] = useState<ColumnSpec[]>([
    { key: 'year', label: 'Year' },
    { key: 'population', label: 'Population' },
    { key: 'co2', label: 'co2' },
    { key: 'co2_per_capita', label: 'co2_per_capita' },
  ]);

  const [localOverrides, setLocalOverrides] = useState<
    Record<string, boolean | undefined>
  >({});
  const [isPending, startTransition] = useTransition();

  const setYear = (y: number) => startTransition(() => _setYear(y));
  const setSortBy = (s: SortKey) => startTransition(() => _setSortBy(s));
  const setRegionsSelected = (r: string[]) =>
    startTransition(() => _setRegionsSelected(r));
  const setSelectedCols = (cols: ColumnSpec[]) =>
    startTransition(() => {
      _setSelectedCols(cols);
      const currentKey = sortBy.replace(/_(asc|desc)$/, '');
      if (!cols.some((c) => c.key === currentKey)) {
        const firstKey = cols[0]?.key || 'name';
        _setSortBy(`${firstKey}_asc`);
      }
    });

  const regions = useMemo(() => {
    const s = new Set<string>(['All']);
    for (const c of all) {
      if (!c.iso) s.add(c.name);
    }
    return Array.from(s).sort();
  }, [all]);

  const regionLabel = useMemo(() => {
    const rest = regionsSelected.filter((r) => r !== 'All');
    return rest.length ? `${rest}` : 'Not Selected';
  }, [regionsSelected]);

  const {
    result: filteredCountries,
    loading,
    runWorker,
  } = useDataWorker(all, deferredSearch, regionsSelected);

  const onToggleYearOrder = useCallback(() => {
    startTransition(() => {
      setYearOrderDesc((prev) => !prev);
    });
  }, [startTransition]);

  const toggleLocalOverride = useCallback(
    (code: string) => {
      setLocalOverrides((prev) => ({
        ...prev,
        [code]: prev[code] === undefined ? !yearOrderDesc : !prev[code],
      }));
    },
    [yearOrderDesc]
  );

  const resetLocalOverrides = useCallback(() => {
    setLocalOverrides({});
  }, []);

  const sortOptions = useMemo(
    () =>
      generateSortOptions(selectedCols).map((o) => ({
        value: `${o.key}_asc` as SortKey,
        label: o.label,
      })),
    [selectedCols]
  );

  const visibleCountries = useVisibleCountries(filteredCountries, sortBy, year);

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
    isPending,
    yearOrderDesc,
    onToggleYearOrder,
    localOverrides,
    toggleLocalOverride,
    resetLocalOverrides,
    sortOptions,
  };
}
