import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useApi<T>(
  key: string,
  path: string,
  options?: Omit<UseQueryOptions<T, Error, T, [string, string]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, Error, T, [string, string]>({
    queryKey: [key, path],
    queryFn: async () => {
      const res = await fetch(path);
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<T>;
    },
    ...options,
  });
}
