import type { CountryEntry } from '../types';

self.onmessage = (e: MessageEvent) => {
  const { countries, search, regionsSelected } = e.data as {
    countries: CountryEntry[];
    search: string;
    regionsSelected: string[];
  };

  const needle = search.trim().toLowerCase();

  const filtered = countries.filter((c) => {
    const byRegion =
      regionsSelected.includes('All') ||
      (!c.iso && regionsSelected.includes(c.name));

    const byName = needle.length === 0 || c.name.toLowerCase().includes(needle);

    return byRegion && byName;
  });

  self.postMessage(filtered);
};
