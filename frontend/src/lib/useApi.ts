import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function useApi<T>(
  key: string,
  path: string,
  options?: Omit<UseQueryOptions<T, Error, T, [string, string]>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<T, Error, T, [string, string]>({
    queryKey: [key, path],
    queryFn: async () => {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const url = baseUrl ? new URL(path, baseUrl).toString() : path;
      const res = await fetch(url);
      if (!res.ok) throw new Error(res.statusText);
      return res.json() as Promise<T>;
    },
    ...options,
  });
}
