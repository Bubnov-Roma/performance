import { memo, useCallback, useMemo, useState } from 'react';
import { useCountries } from '../hooks/useCountries';
import { useAppState } from '../hooks/useAppState';
import type { ColumnSpec } from '../types';
import { CountryList } from '../components/CountryList';
import { ColumnSelectorModal } from '../components/ColumnSelectorModal';
import { Controls } from '../components/Controls';
import { Loader } from './Loader';
import { AboutModal } from './AboutModal';

function LazyComponentImpl() {
  const allCountries = useCountries();
  const app = useAppState(allCountries);

  const [columnsOpen, setColumnsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);

  const openColumns = useCallback(() => setColumnsOpen(true), []);
  const closeColumns = useCallback(() => setColumnsOpen(false), []);
  const openAbout = useCallback(() => setAboutOpen(true), []);
  const closeAbout = useCallback(() => setAboutOpen(false), []);

  const availableColumns = useMemo<ColumnSpec[]>(() => {
    const keys = new Set<string>();
    let scanned = 0;
    for (const c of allCountries) {
      for (const r of c.data) {
        Object.keys(r).forEach((k) => {
          if (!['year', 'population', 'co2', 'co2_per_capita'].includes(k))
            keys.add(k);
        });
        scanned++;
        if (scanned > 200) break;
      }
      if (scanned > 200) break;
    }
    return Array.from(keys)
      .sort()
      .map((k) => ({ key: k, label: k }));
  }, [allCountries]);

  const onToggleColumn = useCallback(
    (key: string) => {
      const exists = app.selectedCols.some((c) => c.key === key);
      if (exists) {
        const newCols = app.selectedCols.filter((c) => c.key !== key);
        app.setSelectedCols(newCols);
        if (app.sortBy.replace(/_(asc|desc)$/, '') === key) {
          const firstKey = newCols[0]?.key || 'name';
          app.setSortBy(`${firstKey}_asc`);
        }
      } else {
        const newCols = [...app.selectedCols, { key, label: key }];
        app.setSelectedCols(newCols);
        if (
          !newCols.some((c) => c.key === app.sortBy.replace(/_(asc|desc)$/, ''))
        ) {
          app.setSortBy(`${key}_asc`);
        }
      }
    },
    [app]
  );

  return (
    <div className="max-w-7xl mx-auto p-4">
      <header className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            React Performance — CO₂ by Country
          </h1>
          <p className="text-sm text-gray-600">
            Suspense loading • memoized filters • large dataset
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={app.onToggleYearOrder}
            className="px-3 py-2 rounded-xl border shadow"
          >
            {app.yearOrderDesc ? 'Years in Cards ↓' : 'Years in Cards ↑'}
          </button>
          <button
            onClick={app.resetLocalOverrides}
            className="px-3 py-2 rounded-xl border shadow"
          >
            Reset All Cards
          </button>
          <button
            onClick={openColumns}
            className="px-3 py-2 rounded-xl border shadow hover:bg-gray-70"
          >
            Select Columns
          </button>
          <button
            onClick={openAbout}
            className="px-3 py-2 rounded-xl border shadow hover:bg-gray-70"
          >
            About Project
          </button>
        </div>
      </header>

      <Controls
        search={app.search}
        onSearch={app.setSearch}
        onSearchSubmit={app.runWorker}
        year={app.year}
        onYear={app.setYear}
        years={app.years}
        sortBy={app.sortBy}
        onSort={app.setSortBy}
        regions={app.regions}
        regionsSelected={app.regionsSelected}
        onRegionsChange={app.setRegionsSelected}
        regionLabel={app.regionLabel}
        selectedCols={app.selectedCols}
      />

      <Loader loading={app.loading} pending={app.isPending} />

      <CountryList
        countries={app.visibleCountries}
        selectedCols={app.selectedCols}
        highlightYear={app.year}
        yearOrderDesc={app.yearOrderDesc}
        localOverrides={app.localOverrides}
        toggleLocalOverride={app.toggleLocalOverride}
      />

      <ColumnSelectorModal
        open={columnsOpen}
        onClose={closeColumns}
        available={availableColumns}
        selected={app.selectedCols}
        onToggleKey={onToggleColumn}
      />

      <AboutModal open={aboutOpen} onClose={closeAbout} />
    </div>
  );
}

const LazyComponent = memo(LazyComponentImpl);

export default LazyComponent;
