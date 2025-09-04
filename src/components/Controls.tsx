import { memo, useEffect, useMemo, useRef, useState } from 'react';
import type { SortKey, ColumnSpec } from '../types';
import { DropdownList } from './DropdownSelect';
import { generateSortOptions } from '../utils/sortOptions';

interface ControlsProps {
  search: string;
  onSearch: (v: string) => void;
  onSearchSubmit: () => void;
  year: number;
  onYear: (y: number) => void;
  years: number[];
  sortBy: SortKey;
  onSort: (s: SortKey) => void;
  regions: string[];
  regionsSelected: string[];
  onRegionsChange: (regions: string[]) => void;
  regionLabel: string;
  selectedCols: ColumnSpec[];
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
  regions,
  regionsSelected,
  onRegionsChange,
  regionLabel,
  selectedCols,
}: ControlsProps) {
  const [openRegions, setOpenRegions] = useState(false);
  const refRegions = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openRegions) return;
    const onClick = (ev: MouseEvent) => {
      if (
        refRegions.current &&
        !refRegions.current.contains(ev.target as Node)
      ) {
        setOpenRegions(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, [openRegions]);

  const sortOptions = useMemo(
    () => generateSortOptions(selectedCols),
    [selectedCols]
  );

  return (
    <section className="mt-4 grid gap-3 md:grid-cols-4">
      {/* Search input */}
      <div className="flex items-center gap-2 relative">
        <input
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search country…"
          className="w-full px-3 py-2 rounded-xl border shadow"
        />
        <button
          onClick={onSearchSubmit}
          className="rounded-xl absolute right-[10px] top-1/2 -translate-y-1/2 border-none bg-transparent text-link cursor-pointer p-1 flex items-center justify-center transition duration-200 ease-in-out"
          aria-label="Apply filters"
          title="Apply filters"
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
      {/* Year dropdown */}
      <DropdownList
        label="Select year"
        value={year}
        options={years.map((y) => ({ label: String(y), value: y }))}
        onChange={(v) => onYear(v as number)}
        type="radio"
      />
      {/* Regions dropdown */}
      <DropdownList
        label={regionLabel}
        value={regionsSelected}
        options={regions.map((reg) => ({ label: reg, value: reg }))}
        onChange={(v) => onRegionsChange(v as string[])}
        type="checkbox"
        footer={({ close }) => (
          <div className="flex gap-2 items-center">
            <button
              onClick={() => onRegionsChange(['All'])}
              className="px-2 py-1 rounded border text-sm"
            >
              Select All
            </button>
            <button
              onClick={() => onRegionsChange([])}
              className="px-2 py-1 rounded border text-sm"
            >
              Clear All
            </button>
            <button
              onClick={() => {
                onSearchSubmit();
                close();
              }}
              className="ml-auto px-3 py-1 rounded border text-sm"
            >
              Apply
            </button>
          </div>
        )}
      />
      {/* Sort by dropdown */}
      <DropdownList
        label={`${sortBy.endsWith('_asc') ? '↑' : '↓'} ${
          sortOptions.find((o) => sortBy.startsWith(o.key.replace(/_asc$/, '')))
            ?.label ?? ''
        }`}
        value={sortBy}
        options={sortOptions.map((o) =>
          o.dual
            ? { label: o.label, key: o.key, dual: true }
            : { label: o.label, value: o.key }
        )}
        onChange={(s) => onSort(s as SortKey)}
        type="radio-dual"
      />
    </section>
  );
}

export const Controls = memo(ControlsImpl);
