import { FethcerHookReturn, fetcher } from './base';
import useSWR from 'swr';

export const useInitial = (): FethcerHookReturn => {
  const { isLoading, data, error, mutate } = useSWR({ path: '/' }, fetcher);

  return { isLoading, data, error, mutate };
};
