import type { CountryEntry, YearRow } from '../types';

function extractRegionFromRow(r: YearRow): string | undefined {
  const tryKeys = ['continent', 'region', 'world_6region'];
  for (const k of tryKeys) {
    const v = r[k];
    if (typeof v === 'string' && v.trim().length > 0) return v;
  }
  return undefined;
}

self.onmessage = (e: MessageEvent) => {
  const { countries, search, region } = e.data as {
    countries: CountryEntry[];
    search: string;
    region: string;
  };

  const needle = search.trim().toLowerCase();

  const filtered = countries.filter((c) => {
    const byRegion =
      region === 'All' ||
      c.data.some((r) => extractRegionFromRow(r) === region);

    const byName = needle.length === 0 || c.name.toLowerCase().includes(needle);

    return byRegion && byName;
  });

  self.postMessage(filtered);
};
