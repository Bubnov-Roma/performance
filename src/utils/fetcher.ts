const CO2_URL =
  'https://nyc3.digitaloceanspaces.com/owid-public/data/co2/owid-co2-data.json';

export async function fetchCO2Data(): Promise<import('../types').Dataset> {
  const res = await fetch(CO2_URL, { cache: 'force-cache' });
  if (!res.ok) throw new Error('Failed to fetch CO2 dataset');
  const json = (await res.json()) as import('../types').Dataset;
  return json;
}
