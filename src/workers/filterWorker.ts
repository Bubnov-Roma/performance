import type { CountryEntry, SortKey, YearRow } from '../types';

function extractRegionFromRow(r: YearRow): string | undefined {
  const tryKeys = ['continent', 'region', 'world_6region'];
  for (const k of tryKeys) {
    const v = r[k];
    if (typeof v === 'string' && v.trim().length > 0) return v;
  }
  return undefined;
}

self.onmessage = (e: MessageEvent) => {
  const { countries, search, region, sortBy, year } = e.data as {
    countries: CountryEntry[];
    search: string;
    region: string;
    sortBy: SortKey;
    year: number;
  };

  const needle = search.trim().toLowerCase();

  const filtered = countries.filter((c) => {
    const byRegion =
      region === 'All' ||
      c.data.some((r) => extractRegionFromRow(r) === region);
    const byName = needle.length === 0 || c.name.toLowerCase().includes(needle);
    return byRegion && byName;
  });

  let result: CountryEntry[];
  if (sortBy === 'name') {
    result = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else {
    result = [...filtered].sort((a, b) => {
      const pa = a.data.find((r) => r.year === year)?.population ?? 0;
      const pb = b.data.find((r) => r.year === year)?.population ?? 0;
      return pb - pa;
    });
  }

  self.postMessage(result);
};
