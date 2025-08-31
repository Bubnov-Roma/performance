import { useCallback, useEffect, useRef, useState } from 'react';
import type { CountryEntry } from '../types';
import Worker from '../workers/filterWorker?worker';

export function useDataWorker(
  all: CountryEntry[],
  search: string,
  regionsSelected: string[]
) {
  const [result, setResult] = useState<CountryEntry[]>(all);
  const [loading, setLoading] = useState(false);
  const workerRef = useRef<Worker>(undefined);

  useEffect(() => {
    workerRef.current = new Worker();

    workerRef.current.onmessage = (e) => {
      setResult(e.data);
      setLoading(false);
    };

    return () => workerRef.current?.terminate();
  }, []);

  const runWorker = useCallback(() => {
    if (workerRef.current) {
      setLoading(true);
      workerRef.current.postMessage({
        countries: all,
        search,
        regionsSelected,
      });
    }
  }, [all, search, regionsSelected]);

  return { result, loading, runWorker };
}
