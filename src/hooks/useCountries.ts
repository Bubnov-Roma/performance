import { useMemo } from 'react';
import { createResource } from '../utils/resource';
import { fetchCO2Data } from '../utils/fetcher';
import type { CountryEntry, Dataset } from '../types';

let datasetResource: ReturnType<typeof createResource<Dataset>> | null = null;

function ensureResource() {
  if (!datasetResource) datasetResource = createResource(fetchCO2Data);
  return datasetResource;
}

export function useDataset(): Dataset {
  return ensureResource().read();
}

export function useCountries(): CountryEntry[] {
  const ds = useDataset();
  const countries = useMemo<CountryEntry[]>(() => {
    return Object.entries(ds).map(([code, raw]) => ({
      code,
      name: raw.country ?? code,
      iso: raw.iso_code,
      data: raw.data ?? [],
    }));
  }, [ds]);
  return countries;
}
