import React, { memo, useCallback } from 'react';
import type { SortKey } from '../types';

interface ControlsProps {
  search: string;
  onSearch: (v: string) => void;
  onSearchSubmit: () => void;
  year: number;
  onYear: (y: number) => void;
  years: number[];
  sortBy: SortKey;
  onSort: (s: SortKey) => void;
  region: string;
  onRegion: (r: string) => void;
  regions: string[];
}

function ControlsImpl({
  search,
  onSearch,
  onSearchSubmit,
  year,
  onYear,
  years,
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
    (e: React.ChangeEvent<HTMLSelectElement>) => onYear(Number(e.target.value)),
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
      <div className="flex items-center gap-2 relative">
        <input
          value={search}
          onChange={onInput}
          placeholder="Search country…"
          className="w-full px-3 py-2 rounded-xl border shadow"
        />
        <button
          onClick={onSearchSubmit}
          className="rounded-xl absolute right-[10px] top-1/2 -translate-y-1/2 border-none bg-transparent text-link cursor-pointer p-1 flex items-center justify-center transition duration-200 ease-in-out"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-4 h-4"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </button>
      </div>
      <div className="flex items-center gap-2">
        <select
          value={year}
          onChange={onYearChange}
          className="w-full px-3 py-2 rounded-xl border shadow max-h-60 overflow-y-auto"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div>
        <select
          value={region}
          onChange={onRegionChange}
          className="w-full px-3 py-2 rounded-xl border shadow"
        >
          {regions.map((r) => (
            <option key={r} value={r}>
              {r === 'All' ? 'All Regions' : r}
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
          <option value="name_desc">Sort: Name (Z→A)</option>
          <option value="population">Sort: Population (desc)</option>
          <option value="population_asc">Sort: Population (asc)</option>
        </select>
      </div>
    </section>
  );
}

export const Controls = memo(ControlsImpl);
