import React, { memo, useCallback } from 'react';
import type { SortKey } from '../types';

interface ControlsProps {
  search: string;
  onSearch: (v: string) => void;
  year: number;
  onYear: (y: number) => void;
  minYear: number;
  maxYear: number;
  sortBy: SortKey;
  onSort: (s: SortKey) => void;
  region: string;
  onRegion: (r: string) => void;
  regions: string[];
}

function ControlsImpl({
  search,
  onSearch,
  year,
  onYear,
  minYear,
  maxYear,
  sortBy,
  onSort,
  region,
  onRegion,
  regions,
}: ControlsProps) {
  const onInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onSearch(e.target.value),
    [onSearch]
  );
  const onYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => onYear(Number(e.target.value)),
    [onYear]
  );
  const onSortChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) =>
      onSort(e.target.value as SortKey),
    [onSort]
  );
  const onRegionChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => onRegion(e.target.value),
    [onRegion]
  );

  return (
    <section className="mt-4 grid gap-3 md:grid-cols-4">
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={onInput}
          placeholder="Search country…"
          className="w-full px-3 py-2 rounded-xl border shadow"
        />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Year</label>
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={year}
          onChange={onYearChange}
          className="w-full"
        />
        <span className="w-16 text-right tabular-nums">{year}</span>
      </div>
      <div>
        <select
          value={region}
          onChange={onRegionChange}
          className="w-full px-3 py-2 rounded-xl border shadow"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          value={sortBy}
          onChange={onSortChange}
          className="w-full px-3 py-2 rounded-xl border shadow"
        >
          <option value="name">Sort: Name (A→Z)</option>
          <option value="population">Sort: Population (desc)</option>
        </select>
      </div>
    </section>
  );
}

export const Controls = memo(ControlsImpl);
