import { memo, useCallback, useEffect, useRef, useState } from 'react';
import type { SortKey } from '../types';
import { DropdownSelect } from './DropdownSelect';

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

  const toggleRegion = useCallback(
    (reg: string) => {
      const set = new Set(regionsSelected);
      if (set.has(reg)) set.delete(reg);
      else set.add(reg);
      onRegionsChange(Array.from(set));
    },
    [regionsSelected, onRegionsChange]
  );

  return (
    <section className="mt-4 grid gap-3 md:grid-cols-4">
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

      <DropdownSelect
        label="Select year"
        value={year}
        options={years.map((y) => ({ label: String(y), value: y }))}
        onChange={(y) => onYear(Number(y))}
      />

      <div className="relative" ref={refRegions}>
        <button
          className="w-full px-3 py-2 rounded-xl border shadow flex items-center justify-between"
          onClick={() => setOpenRegions((o) => !o)}
        >
          <span className="truncate">{regionLabel}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ml-2"
          >
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>

        {openRegions && (
          <div className="absolute z-20 mt-2 w-full rounded-xl border backdrop-blur-xl shadow max-h-64 flex flex-col">
            <div className="flex-1 overflow-auto">
              {regions.map((reg) => (
                <label
                  key={reg}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-10 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={regionsSelected.includes(reg)}
                    onChange={() => toggleRegion(reg)}
                  />
                  <span className="text-sm">
                    {reg === 'All' ? 'All Regions' : reg}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-2 items-center border-t p-2 sticky bottom-0">
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
                Clear
              </button>
              <button
                onClick={() => {
                  onSearchSubmit();
                  setOpenRegions(false);
                }}
                className="ml-auto px-3 py-1 rounded border text-sm"
              >
                Apply
              </button>
            </div>
          </div>
        )}
      </div>

      <DropdownSelect
        label="Sort by"
        value={sortBy}
        options={[
          { value: 'name', label: 'Name (A→Z)' },
          { value: 'name_desc', label: 'Name (Z→A)' },
          { value: 'population', label: 'Population (desc)' },
          { value: 'population_asc', label: 'Population (asc)' },
        ]}
        onChange={(s) => onSort(s as SortKey)}
      />
    </section>
  );
}

export const Controls = memo(ControlsImpl);
