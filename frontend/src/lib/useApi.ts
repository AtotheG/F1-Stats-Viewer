import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export function useApi<T>(key: string, path: string, options?: UseQueryOptions<T>) {
  return useQuery<T>({
    queryKey: [key, path],
    queryFn: async () => {
      const res = await fetch(path);
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<T>;
    },
    ...options,
  });
}
