export interface YearRow {
  year: number;
  population?: number;
  co2?: number;
  co2_per_capita?: number;
  [key: string]: number | string | undefined;
}

export interface CountryEntryRaw {
  country?: string;
  iso_code?: string;
  data: YearRow[];
  continent?: string;
  region?: string;
}

export type Dataset = Record<string, CountryEntryRaw>;

export interface CountryEntry {
  code: string;
  name: string;
  iso?: string;
  data: YearRow[];
}

export type SortKey = 'name' | 'population';

export interface ColumnSpec {
  key: string;
  label: string;
}
