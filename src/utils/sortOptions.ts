import type { ColumnSpec } from '../types';

export interface SortOption {
  key: string;
  label: string;
  dual?: boolean;
}

export function generateSortOptions(selectedCols: ColumnSpec[]): SortOption[] {
  const base = [
    { key: 'name', label: 'Name', dual: true },
    { key: 'population', label: 'Population', dual: true },
    { key: 'co2', label: 'co2', dual: true },
    { key: 'co2_per_capita', label: 'co2_per_capita', dual: true },
  ];

  const extra = selectedCols
    .filter(
      (c) => !['year', 'population', 'co2', 'co2_per_capita'].includes(c.key)
    )
    .map((c) => ({ key: c.key, label: c.label, dual: true }));

  return [...base, ...extra];
}
