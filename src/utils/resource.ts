export function createResource<T>(fn: () => Promise<T>) {
  let status: 'pending' | 'success' | 'error' = 'pending';
  let result: T;
  let error: unknown;
  const promise = fn().then(
    (r) => {
      status = 'success';
      result = r;
    },
    (e) => {
      status = 'error';
      error = e;
    }
  );
  return {
    read(): T {
      if (status === 'pending') throw promise;
      if (status === 'error') throw error;
      return result;
    },
  };
}
