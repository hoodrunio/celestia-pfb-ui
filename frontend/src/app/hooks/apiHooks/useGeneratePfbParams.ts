import { FethcerHookReturn, fetcher } from './base';
import useSWR from 'swr';

export const useGetPbfTxData = (): FethcerHookReturn => {
  const { isLoading, data, error, mutate } = useSWR(
    { path: '/generate_pfb_tx_data' },
    fetcher
  );

  return { isLoading, data, error, mutate };
};
